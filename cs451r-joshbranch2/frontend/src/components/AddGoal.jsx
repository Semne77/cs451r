import React, { useState } from "react";
import axios from "axios";

const AddGoal = ({
  setShowForm,
  goals,
  setGoals,
  userId,
}) => {
  const [formData, setFormData] = useState({
    goalType: "",
    category: "",
    targetAmount: "",
    period: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

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
      const res = await axios.post("http://localhost:8080/goals/add", newGoal);
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
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-1 text-white rounded bg-gray-800"
              required
            />
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
            <input
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full p-1 text-white rounded bg-gray-800"
              required
            />
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

          <div>
            <label className="block text-sm">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
        </form>
      </div>
    </div>
  );
};

export default AddGoal;
