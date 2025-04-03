import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";

const Settings = () => {
  const params = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/users/${params.id}`);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          password: "" // don't prefill passwords
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/users/update/${params.id}`, formData);
      setMessage("Settings updated successfully!");
    } catch (err) {
      console.error("Failed to update settings:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="flex">
            <Sidebar />
    <div className="p-8 text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {message && <p className="mb-4 text-sm text-green-400">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["firstName", "lastName", "email", "phone", "password"].map((field) => (
          <div key={field}>
            <label className="block text-sm capitalize mb-1">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full p-2 rounded text-white bg-gray-800"
              required={field !== "phone"}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
      </div>
      </div>
  );
};

export default Settings;
