import React from "react";
import axios from "axios";

const AddTransaction = ({
    setShowForm,
    formData,
    setFormData,
    transactions,
    setTransactions,
    incomeCategories,
    expenseCategories,
    userId,
}) => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const amt = parseFloat(formData.amount);
        const finalAmount = formData.type === "Expense" ? -Math.abs(amt) : Math.abs(amt);

        const newTransaction = {
            userId: parseInt(userId),
            merchant: formData.merchant,
            category: formData.category,
            transactionDate: new Date(formData.transactionDate).toISOString(),
            amount: finalAmount,
        };

        try {
            await axios.post("http://localhost:8080/transactions/add", newTransaction);
            setTransactions((prev) => [...prev, newTransaction]);
            setShowForm(false);
            setFormData({
                type: "Expense",
                merchant: "",
                category: "",
                transactionDate: new Date().toISOString().split("T")[0],
                amount: "",
            });
        } catch (err) {
            console.error("Failed to add transaction", err);
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const lines = text.trim().split("\n");

            const newTransactions = lines.map((line) => {
                const [amount, date, merchant, category] = line.split("\t");
                return {
                    amount: parseFloat(amount),
                    transactionDate: new Date(date).toISOString(),
                    merchant: merchant.trim(),
                    category: category.trim(),
                    userId: parseInt(userId), // 👈 from props
                };
            });

            const response = await axios.post("http://localhost:8080/transactions/bulk", newTransactions);
            setTransactions((prev) => [...prev, ...response.data]);
            setShowForm(false);
        } catch (err) {
            console.error("Bulk upload failed", err);
            alert("Failed to upload transactions.");
        }
    };



    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowForm(false)}
        >
            <div
                className="bg-card p-6 rounded-xl w-full max-w-md text-white relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Income"
                                checked={formData.type === "Income"}
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value, category: "" })
                                }
                            />
                            Income
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Expense"
                                checked={formData.type === "Expense"}
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value, category: "" })
                                }
                            />
                            Expense
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm">Merchant</label>
                        <input
                            type="text"
                            value={formData.merchant}
                            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                            list="merchant-options"
                            className="w-full p-1 text-white rounded bg-gray-800"
                            required
                        />
                        <datalist id="merchant-options">
                            {[...new Set(transactions.map((t) => t.merchant).filter(Boolean))].map(
                                (merchant, i) => (
                                    <option key={i} value={merchant} />
                                )
                            )}
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-1 text-white rounded bg-gray-800"
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {(formData.type === "Income" ? incomeCategories : expenseCategories).map(
                                (cat, i) => (
                                    <option key={i} value={cat}>
                                        {cat}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm">Date</label>
                        <input
                            type="date"
                            value={formData.transactionDate}
                            onChange={(e) =>
                                setFormData({ ...formData, transactionDate: e.target.value })
                            }
                            className="w-full p-1 text-white rounded bg-gray-800"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full p-1 text-white rounded bg-gray-800"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                    <hr className="my-4 border-gray-700" />
                    <p className="text-sm mb-2">Or upload a .tsv to bulk import:</p>
                    <input
                        type="file"
                        accept=".tsv"
                        className="block w-full text-sm text-white mb-2 bg-gray-700 hover:bg-gray-800"
                        onChange={handleBulkUpload}
                    />
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
