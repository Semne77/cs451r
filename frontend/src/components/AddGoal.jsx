import React, { useState, useEffect } from "react";
import axios from "axios";

const allCategories = [
  "Wages", "Freelance", "Investments", "Gifts", "Refunds", "Credits", "Other Income",
  "Rent", "Mortgage", "Maintenance", "Utilities", "Restaurants", "Supermarkets", "Gasoline", "Transit", "Parking",
  "Insurance", "Medical Bills", "Merchandise", "Services", "Clothing", "Education", "Entertainment", "Donations",
  "Payments", "Travels", "Taxes", "Other Expenses"
];

const AddGoal = ({ setShowForm, goals, setGoals, userId }) => {
  const today = new Date();
  const [formData, setFormData] = useState({
    goalType: "",
    category: "",
    targetAmount: "",
    period: "week",
    startDate: today.toISOString().split("T")[0],
    endDate: "", // Will be calculated
  });

  // Update endDate when period changes
  useEffect(() => {
    const start = new Date(formData.startDate);
    const end = new Date(start);

    switch (formData.period) {
      case "week":
        end.setDate(end.getDate() + 7);
        break;
      case "month":
        end.setMonth(end.getMonth() + 1);
        break;
      case "year":
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      endDate: end.toISOString().split("T")[0],
    }));
  }, [formData.period, formData.startDate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGoal = {
      userId: parseInt(userId),
      goalType: formData.goalType,
      category: formData.category,
      targetAmount: parseFloat(formData.targetAmount),
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/goals", newGoal);
      setGoals([...goals, res.data]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add goal:", err);
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
        <h2 className="text-lg font-bold mb-4">Add Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Goal Type</label>
            <input
              type="text"
              value={formData.goalType}
              onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
              className="w-full p-1 text-white rounded bg-gray-800"
              required
            />
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
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Target Amount</label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className="w-full p-1 text-white rounded bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Period</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full p-1 text-white rounded bg-gray-800"
              required
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full p-1 text-white rounded bg-gray-800"
              required
            />
          </div>


          <div className="text-sm text-gray-400">
            Start Date: <span className="text-white">{formData.startDate}</span><br />
            End Date: <span className="text-white">{formData.endDate}</span>
          </div>

          <div className="flex justify-end gap-4 mt-4">
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
        </form>
      </div>
    </div>
  );
};

export default AddGoal;
