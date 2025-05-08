import React, { useEffect, useState } from "react";
import axios from "axios";

const EditTransaction = ({
  selectedTransactions,
  setShowEditForm,
  transactions,
  setTransactions,
  expenseCategories,
  incomeCategories,
}) => {
  const [formData, setFormData] = useState({
    merchant: "",
    category: "",
    amount: "",
    transactionDate: "",
  });

  useEffect(() => {
    const fieldCheck = (key) => {
      const values = selectedTransactions.map((t) => t[key]).filter(Boolean);
      return [...new Set(values)].length === 1 ? values[0] : "";
    };

    setFormData({
      merchant: fieldCheck("merchant"),
      category: fieldCheck("category"),
      amount: fieldCheck("amount") === "" ? "" : Math.abs(fieldCheck("amount")).toString(),
      transactionDate: fieldCheck("transactionDate")?.split("T")[0],
    });
  }, [selectedTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {};
    if (formData.merchant) updates.merchant = formData.merchant;
    if (formData.amount) {
      const categoryToCheck = formData.category || updates.category;
      if (expenseCategories.includes(categoryToCheck)) {
        updates.amount = -Math.abs(parseFloat(formData.amount));
      } else {
        updates.amount = Math.abs(parseFloat(formData.amount));
      }
    }
    if (formData.category) updates.category = formData.category;
    if (formData.transactionDate) {
      updates.transactionDate = new Date(formData.transactionDate).toISOString();
    }

    try {
      const ids = selectedTransactions.map((tx) => tx.id);
      console.log("Editing transactions", { ids, updates });
      await axios.put("http://localhost:8080/transactions/edit", { ids, updates });

      const updated = transactions.map((t) =>
        ids.includes(t.id) ? { ...t, ...updates } : t
      );
      setTransactions(updated);
      setShowEditForm(false);
    } catch (err) {
      console.error("Failed to edit transactions", err);
    }
  };

  const allCategories = [...new Set([...incomeCategories, ...expenseCategories])];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setShowEditForm(false)}
    >
      <div
        className="bg-card p-6 rounded-xl w-full max-w-md text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">
          Edit {selectedTransactions.length} Transaction
          {selectedTransactions.length > 1 ? "s" : ""}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["merchant", "category", "amount", "transactionDate"].map((field) => (
            <div key={field}>
              <label className="block text-sm capitalize">{field}</label>
              <input
                type={
                  field === "amount"
                    ? "number"
                    : field === "transactionDate"
                      ? "date"
                      : "text"
                }
                value={formData[field] || ""}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full p-1 text-white rounded bg-gray-800"
                list={field === "category" ? "category-options" : undefined}
              />
            </div>
          ))}

          {/* Datalist for category */}
          <datalist id="category-options">
            {allCategories.map((cat, i) => (
              <option key={i} value={cat} />
            ))}
          </datalist>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
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
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
