import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Plus, Trash, Square, CheckSquare, MinusSquare, Pencil } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AddTransaction from "../components/AddTransaction";
import EditTransaction from "../components/EditTransaction";
import axios from "axios";

function EmptyFieldMessage({ field }) {
    return (
        <div className="mt-64 text-gray-400 font-light text-xs text-center">No {field} to display</div>
    )
}

export default function Transactions() {

    const params = useParams();

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/transactions/${params.id}`);
                setTransactions(res.data);

                // Auto-set date range
                const dates = res.data.map((tx) => new Date(tx.transactionDate));
                if (dates.length > 0) {
                    const minDate = new Date(Math.min(...dates));
                    const maxDate = new Date(Math.max(...dates));
                    setDateMin(minDate);
                    setDateMax(maxDate);
                }
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };

        fetchTransactions();
    }, [params.id]);

    const [selectedMerchants, setSelectedMerchants] = useState([]);
    const [merchantQuery, setMerchantQuery] = useState("");
    const [merchantSort, setMerchantSort] = useState(""); // none, a-z, z-a, total-asc, total-desc, recent, oldest, count-asc, count-desc

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryQuery, setCategoryQuery] = useState("");
    const [categorySort, setCategorySort] = useState(""); // none, a-z, z-a, total-asc, total-desc, recent, oldest, count-asc, count-desc

    const [dateMin, setDateMin] = useState(null);
    const [dateMax, setDateMax] = useState(null);
    const [dateSort, setDateSort] = useState(""); // "recent", "oldest", or ""


    const [amountMin, setAmountMin] = useState(null);
    const [amountMax, setAmountMax] = useState(null);
    const [amountSort, setAmountSort] = useState("");

    const sortTransactions = (txs) => {
        const groupBy = (txs, keyFn) =>
            txs.reduce((acc, tx) => {
                const key = keyFn(tx);
                const amt = parseFloat(tx.amount);
                const date = new Date(tx.transactionDate);

                if (!acc[key]) {
                    acc[key] = { total: 0, count: 0, recent: date, oldest: date };
                }

                acc[key].total += amt;
                acc[key].count += 1;
                if (date > acc[key].recent) acc[key].recent = date;
                if (date < acc[key].oldest) acc[key].oldest = date;

                return acc;
            }, {});

        const merchantGroup = groupBy(txs, (tx) => tx.merchant || "Unknown");
        const categoryGroup = groupBy(txs, (tx) => tx.category || "Uncategorized");

        return [...txs].sort((a, b) => {
            const aAmt = Math.abs(parseFloat(a.amount));
            const bAmt = Math.abs(parseFloat(b.amount));

            // 1. Amount Sort
            if (amountSort === "amount-asc") return aAmt - bAmt;
            if (amountSort === "amount-desc") return bAmt - aAmt;

            // 2. Date Sort
            if (dateSort === "date-new-old") return new Date(b.transactionDate) - new Date(a.transactionDate);
            if (dateSort === "date-old-new") return new Date(a.transactionDate) - new Date(b.transactionDate);

            // 3. Merchant Sort
            if (merchantSort) {
                const mA = a.merchant || "Unknown";
                const mB = b.merchant || "Unknown";

                switch (merchantSort) {
                    case "a-z": return mA.localeCompare(mB);
                    case "z-a": return mB.localeCompare(mA);
                    case "total-asc": return merchantGroup[mA].total - merchantGroup[mB].total;
                    case "total-desc": return merchantGroup[mB].total - merchantGroup[mA].total;
                    case "recent": return new Date(merchantGroup[mB].recent) - new Date(merchantGroup[mA].recent);
                    case "oldest": return new Date(merchantGroup[mA].oldest) - new Date(merchantGroup[mB].oldest);
                    case "count-asc": return merchantGroup[mA].count - merchantGroup[mB].count;
                    case "count-desc": return merchantGroup[mB].count - merchantGroup[mA].count;
                }
            }

            // 4. Category Sort
            if (categorySort) {
                const cA = a.category || "Uncategorized";
                const cB = b.category || "Uncategorized";

                switch (categorySort) {
                    case "a-z": return cA.localeCompare(cB);
                    case "z-a": return cB.localeCompare(cA);
                    case "total-asc": return categoryGroup[cA].total - categoryGroup[cB].total;
                    case "total-desc": return categoryGroup[cB].total - categoryGroup[cA].total;
                    case "recent": return new Date(categoryGroup[cB].recent) - new Date(categoryGroup[cA].recent);
                    case "oldest": return new Date(categoryGroup[cA].oldest) - new Date(categoryGroup[cB].oldest);
                    case "count-asc": return categoryGroup[cA].count - categoryGroup[cB].count;
                    case "count-desc": return categoryGroup[cB].count - categoryGroup[cA].count;
                }
            }

            return 0;
        });
    };




    const getFilteredTransactions = () => {
        let filtered = [...transactions];

        // Filter by date — only if both min and max are defined
        if (dateMin && dateMax) {
            filtered = filtered.filter(tx => {
                const date = new Date(tx.transactionDate);
                return date >= dateMin && date <= dateMax;
            });
        }

        // Filter by amount — only if both min and max are defined
        if (typeof amountMin === "number" && typeof amountMax === "number") {
            filtered = filtered.filter(tx => {
                const amt = Math.abs(parseFloat(tx.amount));
                return amt >= amountMin && amt <= amountMax;
            });
        }

        // Filter by merchant
        if (selectedMerchants.length) {
            filtered = filtered.filter(tx =>
                selectedMerchants.includes(tx.merchant)
            );
        }

        // Filter by category
        if (selectedCategories.length) {
            filtered = filtered.filter(tx =>
                selectedCategories.includes(tx.category)
            );
        }

        return sortTransactions(filtered);
    };


    const filteredTransactions = getFilteredTransactions();

    const formatDate = (dateInput) => {
        const date = new Date(dateInput);

        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const allCategories = [
        "Wages", "Freelance", "Investments", "Gifts", "Refunds", "Credits", "Other Income",
        "Rent", "Mortgage", "Maintenance", "Utilities", "Restaurants", "Supermarkets", "Gasoline", "Transit", "Parking",
        "Insurance", "Medical Bills", "Merchandise", "Services", "Clothing", "Education", "Entertainment", "Donations",
        "Payments", "Travels", "Taxes", "Other Expenses"
    ];

    const incomeCategories = [
        "Wages", "Freelance", "Investments", "Gifts", "Refunds", "Credits", "Other Income"
    ];

    const expenseCategories = [
        "Rent", "Mortgage", "Maintenance", "Utilities", "Restaurants", "Supermarkets", "Gasoline", "Transit", "Parking",
        "Insurance", "Medical Bills", "Merchandise", "Services", "Clothing", "Education", "Entertainment", "Donations",
        "Payments", "Travels", "Taxes", "Other Expenses"
    ];

    const categorySuggestions = allCategories.filter((cat) =>
        cat.toLowerCase().includes(categoryQuery.toLowerCase()) &&
        !selectedCategories.includes(cat)
    );

    const merchantSuggestions = Array.from(new Set(
        transactions
            .map((t) => t.merchant?.trim())
            .filter((m) => m && m.toLowerCase().includes(merchantQuery.toLowerCase()) && !selectedMerchants.includes(m))
    ));


    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        type: "Expense",
        merchant: "",
        category: "",
        transactionDate: new Date().toISOString().split("T")[0],
        amount: ""
    });

    const [selectedTransactions, setSelectedTransactions] = useState([])
    const toggleAll = () => {
        const allIds = filteredTransactions.map(tx => tx.id);
        const isSomeSelected = selectedTransactions.length != 0;
        setSelectedTransactions(isSomeSelected ? [] : allIds);
    };

    const getMasterIcon = () => {
        const selectedCount = selectedTransactions.length;
        const total = filteredTransactions.length;

        if (selectedCount === 0) return <Square onClick={toggleAll} className="cursor-pointer" />;
        if (selectedCount === total) return <CheckSquare onClick={toggleAll} className="cursor-pointer" />;
        return <MinusSquare onClick={toggleAll} className="cursor-pointer" />;
    };

    const toggleTransaction = (id) => {
        setSelectedTransactions((prev) =>
            prev.includes(id) ? prev.filter(txId => txId !== id) : [...prev, id]
        );
    };



    const handleDeleteFiltered = async () => {
        const idsToDelete = selectedTransactions;

        try {
            console.log("Deleting transactions: " + idsToDelete);
            await axios.post("http://localhost:8080/transactions/deleteMany", idsToDelete);
            setTransactions((prev) => prev.filter((tx) => !idsToDelete.includes(tx.id)));
            setSelectedTransactions([]);
        } catch (err) {
            console.error("Failed to delete transactions:", err);
            alert("Something went wrong while deleting.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full h-screen mr-8 ml-8 mt-4 flex-col">
                <h1 className="text-white text-2xl font-bold">Sort & filter your transactions!</h1>
                <div className="mb-4">
                    <label className="text-white block mb-1">Filter by Merchant</label>
                    <input
                        type="text"
                        className="w-full bg-gray-800 text-white px-3 py-1 rounded mb-2"
                        placeholder="Type merchant name..."
                        value={merchantQuery}
                        onChange={(e) => setMerchantQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && merchantQuery.trim()) {
                                if (!selectedMerchants.includes(merchantQuery.trim())) {
                                    setSelectedMerchants([...selectedMerchants, merchantQuery.trim()]);
                                }
                                setMerchantQuery("");
                                setSelectedTransactions([]);
                            }
                        }}
                    />
                    {merchantQuery && merchantSuggestions.length > 0 && (
                        <div className="bg-gray-900 border border-gray-700 rounded mb-2 max-h-40 overflow-y-auto">
                            {merchantSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion}
                                    className="px-3 py-1 hover:bg-gray-700 cursor-pointer text-white"
                                    onClick={() => {
                                        setSelectedMerchants([...selectedMerchants, suggestion]);
                                        setMerchantQuery("");
                                        setSelectedTransactions([]);
                                    }}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedMerchants.map((merchant) => (
                            <div key={merchant} className="bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-2">
                                <span>{merchant}</span>
                                <button
                                    className="text-xs"
                                    onClick={() => {
                                        setSelectedMerchants((prev) => prev.filter((m) => m !== merchant));
                                        setSelectedTransactions([]);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-white block mb-1">Filter by Category</label>
                    <input
                        type="text"
                        className="w-full bg-gray-800 text-white px-3 py-1 rounded mb-1"
                        placeholder="Type category name..."
                        value={categoryQuery}
                        onChange={(e) => setCategoryQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && categoryQuery.trim()) {
                                const match = categorySuggestions[0] || categoryQuery.trim();
                                if (!selectedCategories.includes(match)) {
                                    setSelectedCategories([...selectedCategories, match]);
                                }
                                setCategoryQuery("");
                                setSelectedTransactions([]);
                            }
                        }}
                    />
                    {categoryQuery && categorySuggestions.length > 0 && (
                        <div className="bg-gray-900 border border-gray-700 rounded mb-2 max-h-40 overflow-y-auto">
                            {categorySuggestions.map((suggestion) => (
                                <div
                                    key={suggestion}
                                    className="px-3 py-1 hover:bg-gray-700 cursor-pointer text-white"
                                    onClick={() => {
                                        setSelectedCategories([...selectedCategories, suggestion]);
                                        setCategoryQuery("");
                                        setSelectedTransactions([]);
                                    }}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedCategories.map((category) => (
                            <div key={category} className="bg-purple-600 text-white px-2 py-1 rounded flex items-center gap-2">
                                <span>{category}</span>
                                <button
                                    className="text-xs"
                                    onClick={() => {
                                        setSelectedCategories((prev) => prev.filter((c) => c !== category));
                                        setSelectedTransactions([]);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-x-4 mb-4">
                    <div className="basis-[calc(50%-1rem)]">
                        <label className="text-white block mb-1">Filter by Transaction Date</label>
                        <div className="flex gap-2 items-center mb-2">
                            <input
                                type="date"
                                value={dateMin ? dateMin.toISOString().split("T")[0] : ""}
                                onChange={(e) => {
                                    setDateMin(new Date(e.target.value));
                                    setSelectedTransactions([]);
                                }}
                                className="bg-gray-800 text-white px-3 py-1 w-1/2 rounded"
                            />
                            <span className="text-white">to</span>
                            <input
                                type="date"
                                value={dateMax ? dateMax.toISOString().split("T")[0] : ""}
                                onChange={(e) => {
                                    setDateMax(new Date(e.target.value));
                                    setSelectedTransactions([]);
                                }}
                                className="bg-gray-800 text-white px-3 py-1 w-1/2 rounded"
                            />
                        </div>
                    </div>

                    <div className="basis-[calc(50%-1rem)]">
                        <label className="text-white block mb-1">Filter by Amount</label>
                        <div className="flex gap-2 items-center mb-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={amountMin ?? ""}
                                onChange={(e) => {
                                    setAmountMin(e.target.value ? parseFloat(e.target.value) : null);
                                    setSelectedTransactions([]);
                                }}
                                className="bg-gray-800 text-white px-3 py-1 rounded w-1/2"
                            />
                            <span className="text-white">to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={amountMax ?? ""}
                                onChange={(e) => {
                                    setAmountMax(e.target.value ? parseFloat(e.target.value) : null);
                                    setSelectedTransactions([]);
                                }}
                                className="bg-gray-800 text-white px-3 py-1 rounded w-1/2"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-4 mb-4">
                    <div className="basis-[calc(25%-1rem)]">
                        <label className="text-white block mb-1">Sort Merchants</label>
                        <select
                            className="bg-gray-800 text-white px-3 py-1 w-full rounded"
                            value={merchantSort}
                            onChange={(e) => {
                                setMerchantSort(e.target.value);
                                setCategorySort("");
                                setDateSort("");
                                setAmountSort("");
                            }}
                        >
                            <option value="">None</option>
                            <option value="a-z">Name: A → Z</option>
                            <option value="z-a">Name: Z → A</option>
                            <option value="total-asc">Total: Low → High</option>
                            <option value="total-desc">Total: High → Low</option>
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest</option>
                            <option value="count-asc"># of Tx: Low → High</option>
                            <option value="count-desc"># of Tx: High → Low</option>
                        </select>
                    </div>

                    <div className="basis-[calc(25%-1rem)]">
                        <label className="text-white block mb-1">Sort Categories</label>
                        <select
                            className="bg-gray-800 text-white px-3 py-1 w-full rounded"
                            value={categorySort}
                            onChange={(e) => {
                                setCategorySort(e.target.value);
                                setDateSort("");
                                setAmountSort("");
                                setMerchantSort("");
                            }}
                        >
                            <option value="">None</option>
                            <option value="a-z">Name: A → Z</option>
                            <option value="z-a">Name: Z → A</option>
                            <option value="total-asc">Total: Low → High</option>
                            <option value="total-desc">Total: High → Low</option>
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest</option>
                            <option value="count-asc"># of Tx: Low → High</option>
                            <option value="count-desc"># of Tx: High → Low</option>
                        </select>
                    </div>

                    <div className="basis-[calc(25%-1rem)]">
                        <label className="text-white block mb-1">Sort by Transaction Date</label>
                        <select
                            className="bg-gray-800 text-white px-3 py-1 w-full rounded"
                            value={dateSort}
                            onChange={(e) => {
                                setDateSort(e.target.value);
                                setAmountSort("");
                                setMerchantSort("");
                                setCategorySort("");
                            }}
                        >
                            <option value="">None</option>
                            <option value="recent">Newest → Oldest</option>
                            <option value="oldest">Oldest → Newest</option>
                        </select>
                    </div>

                    <div className="basis-[calc(25%-1rem)]">
                        <label className="text-white block mb-1">Sort by Amount</label>
                        <select
                            className="bg-gray-800 text-white px-3 py-1 w-full rounded"
                            value={amountSort}
                            onChange={(e) => {
                                setAmountSort(e.target.value);
                                setDateSort("");
                                setMerchantSort("");
                                setCategorySort("");
                            }}
                        >
                            <option value="">None</option>
                            <option value="amount-asc">Amount: Low → High</option>
                            <option value="amount-desc">Amount: High → Low</option>
                        </select>
                    </div>
                </div>


                <div className="flex-col flex mt-4 bg-card rounded-2xl flex-1 h-auto mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-white ml-5 mt-6 text-med font-light">Transactions</p>
                    </div>

                    <div className="flex items-center ml-5 mr-5 mb-2 text-white text-sm h-auto cursor-pointer">
                        {getMasterIcon()}
                        {selectedTransactions.length > 0 && (
                            <button
                                onClick={() => {
                                    const count = selectedTransactions.length;
                                    if (window.confirm(`Are you sure you want to delete ${count} selected transaction${count > 1 ? "s" : ""}?`)) {
                                        handleDeleteFiltered();
                                    }
                                }}
                                className="text-sm bg-red-600 hover:bg-red-700 text-white ml-2 px-2 py-1 rounded"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        )}
                        {selectedTransactions.length > 0 && (
                            <button
                                onClick={() => setShowEditForm(true)}
                                className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white ml-2 px-2 py-1 rounded"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        {selectedTransactions.length == 0 && filteredTransactions.length > 0 && (
                            <span
                                className="text-sm btext-white ml-2"
                            >
                                0 selected
                            </span>
                        )}
                        {showEditForm && (
                            <EditTransaction
                                selectedTransactions={transactions.filter(tx => selectedTransactions.includes(tx.id))}
                                setShowEditForm={setShowEditForm}
                                transactions={transactions}
                                setTransactions={setTransactions}
                                expenseCategories={expenseCategories}
                            />
                        )}


                        <button
                            onClick={() => setShowForm(true)}
                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white text-right ml-auto px-2 py-1 rounded"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {showForm && (
                        <AddTransaction
                            setShowForm={setShowForm}
                            formData={formData}
                            setFormData={setFormData}
                            transactions={transactions}
                            setTransactions={setTransactions}
                            incomeCategories={incomeCategories}
                            expenseCategories={expenseCategories}
                            userId={params.id}
                        />
                    )}

                    {filteredTransactions.length === 0 ? (
                        <p className="text-gray-400 text-xs ml-5 font-light">No transactions in this time period</p>
                    ) : (
                        <ul className="text-white text-sm flex-1 space-y-2 mr-5 ml-5 overflow-y-auto">
                            {filteredTransactions.map((tx) => {
                                const isIncome = parseFloat(tx.amount) > 0;
                                const displayAmount = Math.abs(parseFloat(tx.amount)).toFixed(2);
                                const amountColor = isIncome ? "text-green-400" : "text-red-400";
                                const isSelected = selectedTransactions.includes(tx.id);

                                return (
                                    <li
                                        key={tx.id}
                                        className="flex justify-between items-start border-b border-gray-700 pb-2"
                                    >
                                        <div className="flex items-start gap-2">
                                            <span onClick={() => toggleTransaction(tx.id)} className="mt-1 cursor-pointer">
                                                {isSelected ? <CheckSquare /> : <Square />}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{tx.merchant || "Unknown"}</span>
                                                <span className="text-xs text-gray-400">
                                                    {tx.category || "Uncategorized"} • {formatDate(tx.transactionDate)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`font-medium ${amountColor}`}>${displayAmount}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div >
    )
}