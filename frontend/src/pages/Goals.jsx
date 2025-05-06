import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import AddGoal from "../components/AddGoal";

export default function Goals() {
  const { id } = useParams();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/goals/${id}`);
        setGoals(res.data);
      } catch (err) {
        console.error("Failed to fetch goals", err);
      }
    };
    fetchGoals();
  }, [id]);

  const handleDelete = async (goalId) => {
    try {
      await axios.delete(`http://localhost:8080/api/goals/${goalId}`);
      setGoals((prev) => prev.filter((g) => g.goalId !== goalId));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-2xl font-bold">Your Goals</h1>
          <button
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => setShowForm(true)}
          >
            + Add Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <p className="text-gray-400 text-sm">No goals added yet.</p>
        ) : (
          <ul className="text-white space-y-4">
            {goals.map((goal) => (
              <li
                key={goal.goalId}
                className="bg-gray-800 rounded p-4 shadow border border-gray-700 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-lg">{goal.goalType}</div>
                  <div className="text-sm text-gray-300">
                    {goal.category} • Target: ${goal.targetAmount}
                  </div>
                  <div className="text-xs text-gray-400">
                    {goal.startDate} to {goal.endDate} ({goal.period})
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(goal.goalId)}
                  className="ml-4 text-red-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {showForm && (
          <AddGoal
            setShowForm={setShowForm}
            goals={goals}
            setGoals={setGoals}
            userId={id}
          />
        )}
      </div>
    </div>
  );
}
