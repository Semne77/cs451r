import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import Sidebar from "@/components/Sidebar";
import TransactionChart from "@/components/TransactionChart";
import AddTransaction from "../components/AddTransaction";
import axios from "axios";
import {useNavigate } from "react-router-dom";

function EmptyFieldMessage({ field }) {
    return (
        <div className="mt-64 text-gray-400 font-light text-xs text-center">No {field} to display</div>
    )
}

export default function Dashboard() {

    const params = useParams();
    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate();
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        // Define an async function to fetch user data from the backend
        const fetchUser = async () => {
            try {
                // Make a GET request to fetch the user data using the ID from the URL (params.id)
                // Also send a custom header "user-id" from localStorage for authorization checking
                const res = await axios.get(`http://localhost:8080/users/${params.id}`, {
                    headers: {
                        "user-id": localStorage.getItem("userId")
                    }
                });
    
                // Save the user's first name to state so we can display it
                setFirstName(res.data.firstName);
    
                // Log the full user data for debugging purposes
                console.log("This is my data", res.data);
            } catch (err) {
                // Log any error that happens during the request
                console.error("Failed to fetch user:", err);
            }
        };
    
        // Call the function when the component mounts or when the URL param changes
        fetchUser();
    }, [params.id]); // 🔁 Re-run this effect if the URL parameter (user ID) changes
    

    // 🔁 useEffect to check if the logged-in user is allowed to view the dashboard
    useEffect(() => {
        // Get the currently logged-in user's ID from localStorage
        const storedUserId = localStorage.getItem("userId");

        // Compare the stored ID to the ID in the URL
        if (storedUserId === params.id) {
            // ✅ User is accessing their own dashboard — allow access
            setUnauthorized(false); // Clear any previous "unauthorized" flag
        } else {
            // ❌ User is trying to access someone else's dashboard — block access
            setUnauthorized(true);
        }
    }, [params.id]); // Re-run this check any time the URL changes

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/transactions/${params.id}`);
                setTransactions(res.data);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };

        fetchTransactions();
    }, [params.id]);

    const [timeRange, setTimeRange] = useState("Year");

    const [currentWindowStart, setCurrentWindowStart] = useState(new Date());

    const getDateRange = (range, baseDate) => {
        const date = new Date(baseDate);
        date.setHours(0, 0, 0, 0); // normalize time

        let start, end;

        switch (range) {
            case "Day":
                start = new Date(date);
                end = new Date(date);
                break;

            case "Week": {
                const day = date.getDay(); // 0 = Sunday
                start = new Date(date);
                start.setDate(date.getDate() - day); // back to Sunday

                end = new Date(start);
                end.setDate(start.getDate() + 6); // to Saturday
                break;
            }

            case "Month": {
                start = new Date(date.getFullYear(), date.getMonth(), 1);
                end = new Date(date.getFullYear(), date.getMonth() + 1, 0); // last day of this month
                break;
            }

            case "Year": {
                start = new Date(date.getFullYear(), 0, 1);
                end = new Date(date.getFullYear(), 11, 31);
                break;
            }

            default:
                start = null;
                end = null;
        }

        return { start, end };
    };


    useEffect(() => {
        if (timeRange !== "Everything") {
            const now = new Date();
            const { start } = getDateRange(timeRange, now); // 🆕 align to calendar period
            setCurrentWindowStart(start);
        } else {
            setCurrentWindowStart(null);
        }
    }, [timeRange]);


    const timeRanges = ["Day", "Week", "Month", "Year", "Everything"];

    const calculateTotals = () => {
        let filtered = transactions;

        if (timeRange !== "Everything" && currentWindowStart) {
            const { start, end } = getDateRange(timeRange, currentWindowStart);

            filtered = transactions.filter((t) => {
                const txDate = new Date(t.transactionDate);
                return txDate >= start && txDate <= end;
            });
        }

        let income = 0;
        let spending = 0;

        for (const t of filtered) {
            const amt = parseFloat(t.amount);
            if (amt > 0) income += amt;
            else spending += -amt;
        }

        return {
            income: income.toFixed(2),
            spending: spending.toFixed(2),
            savings: (income - spending).toFixed(2),
        };
    };



    const { income, spending, savings } = calculateTotals();

    const getFilteredTransactions = () => {
        if (timeRange === "Everything" || !currentWindowStart) return transactions;

        const { start, end } = getDateRange(timeRange, currentWindowStart);

        return transactions.filter((t) => {
            const txDate = new Date(t.transactionDate);
            return txDate >= start && txDate <= end;
        });
    };

    const filteredTransactions = getFilteredTransactions();

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        return new Date(b.transactionDate) - new Date(a.transactionDate); // Newest first
    });

    const shiftWindow = (direction) => {
        const current = new Date(currentWindowStart);
        let newDate = new Date(current);

        switch (timeRange) {
            case "Day":
                newDate.setDate(current.getDate() + direction * 1);
                break;
            case "Week":
                newDate.setDate(current.getDate() + direction * 7);
                break;
            case "Month":
                newDate.setMonth(current.getMonth() + direction * 1);
                break;
            case "Year":
                newDate.setFullYear(current.getFullYear() + direction * 1);
                break;
            default:
                return;
        }

        setCurrentWindowStart(newDate);
    };

    const goBackward = () => shiftWindow(-1);
    const goForward = () => shiftWindow(1);

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

    const rangeDisplay = () => {
        if (!currentWindowStart || timeRange === "Everything") return "All Time";

        const { start, end } = getDateRange(timeRange, currentWindowStart);
        return `${formatDate(start)} – ${formatDate(end)}`;
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const { end } = getDateRange(timeRange, currentWindowStart);

    const forwardDisabled = end >= now;

    const backwardDisabled = transactions.every(
        (t) => new Date(t.transactionDate) >= getDateRange(timeRange, currentWindowStart).start
    );

    const incomeCategories = [
        "Wages", "Freelance", "Investments", "Gifts", "Refunds", "Credits", "Other Income"
    ];

    const expenseCategories = [
        "Rent", "Mortgage", "Maintenance", "Utilities", "Restaurants", "Supermarkets", "Gasoline", "Transit", "Parking",
        "Insurance", "Medical Bills", "Merchandise", "Services", "Clothing", "Education", "Entertainment", "Donations",
        "Payments", "Travels", "Taxes", "Other Expenses"
    ];

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: "Expense",
        merchant: "",
        category: "",
        transactionDate: new Date().toISOString().split("T")[0],
        amount: ""
    });

// 🔒 If the user is not authorized to view this page, show an Access Denied screen
if (unauthorized) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            {/* 🚫 Error title */}
            <h1 className="text-3xl font-bold mb-4">🚫 Access Denied</h1>

            {/* Brief explanation */}
            <p className="text-lg">You are trying to view another user's dashboard.</p>

            {/* Redirect button to take user to their own dashboard */}
            <button
                onClick={() => {
                    // Get the logged-in user's ID from localStorage
                    const userId = localStorage.getItem("userId");

                    // Navigate to the correct dashboard
                    navigate(`/dashboard/${userId}`);
                }}
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
                Go to My Dashboard
            </button>
        </div>
    );
}



    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full mr-8 ml-8 mt-4 flex-col">
                <h1 className="text-white text-2xl font-bold">Welcome to your dashboard, {firstName || "loading"}!</h1>
                <div className="mb-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-card text-white rounded-md px-3 py-1"
                    >
                        {timeRanges.map((range) => (
                            <option key={range} value={range}>
                                {range}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-4 text-white mb-4">
                    <button onClick={goBackward} disabled={backwardDisabled}>◀</button>
                    <span>{rangeDisplay()}</span>
                    <button onClick={goForward} disabled={forwardDisabled}>▶</button>
                </div>

                <div className="w-full mt-4 flex gap-4">
                    <div className="flex flex-col flex-1 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-med font-light">Total Income</p>
                        <span className="ml-7 text-white font-bold text-2xl">${income}</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">In {timeRange.toLowerCase()}</p>
                    </div>
                    <div className="flex flex-col flex-1 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-med font-light">Total Spending</p>
                        <span className="ml-7 text-white font-bold text-2xl">${spending}</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">In {timeRange.toLowerCase()}</p>
                    </div>
                    <div className="flex flex-col flex-1 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-med font-light">Total Savings</p>
                        <span className="ml-7 text-white font-bold text-2xl">${savings}</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">In {timeRange.toLowerCase()}</p>
                    </div>
                </div>

                <div className="w-full flex gap-6 mt-4">
                    <div className="flex flex-col min-w-0 flex-[2] h-145 bg-card rounded-2xl">
                        <p className="text-white ml-5 mt-6 text-med font-light">Categories</p>
                        <TransactionChart
                            transactions={filteredTransactions}
                            timeRange={timeRange}
                        />
                    </div>
                    <div className="flex flex-col flex-[1] h-145 bg-card rounded-2xl">
                        <p className="text-white ml-5 mt-6 text-med font-light">Goals</p>
                        <EmptyFieldMessage field={"goals"} />
                    </div>
                </div>

                <div className="flex-col mt-4 bg-card rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-white ml-5 mt-6 text-med font-light">Transactions</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 mr-5 mt-6 rounded"
                        >
                            +
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
                        <p className="text-gray-400 text-xs font-light">No transactions in this time period</p>
                    ) : (
                        <ul className="text-white text-sm space-y-2 max-h-60 mr-5 ml-5 overflow-y-auto">
                            {sortedTransactions.map((tx) => {
                                const isIncome = parseFloat(tx.amount) > 0;
                                const displayAmount = Math.abs(parseFloat(tx.amount)).toFixed(2);
                                const amountColor = isIncome ? "text-green-400" : "text-red-400";

                                return (
                                    <li
                                        key={tx.id}
                                        className="flex justify-between items-start border-b border-gray-700 pb-2"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{tx.merchant || "Unknown"}</span>
                                            <span className="text-xs text-gray-400">
                                                {tx.category || "Uncategorized"} • {formatDate(tx.transactionDate)}
                                            </span>
                                        </div>
                                        <span className={`font-medium ${amountColor}`}>${displayAmount}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}