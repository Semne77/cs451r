import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ TEMPORARY: Fake login (bypass backend)
    const fakeUser = {
      id: 1,
      email: email,
      name: "Test User",
    };

    // Optional: Save user to localStorage (for dashboard use)
    localStorage.setItem("user", JSON.stringify(fakeUser));

    // Navigate to fake dashboard
    navigate("/dashboard/1");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <label className="text-white">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 rounded bg-gray-800 text-white"
      />

      <label className="text-white">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 rounded bg-gray-800 text-white"
      />

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>

      <Link to="/recovery" className="text-blue-400 text-sm text-center">
        Forgot Password?
      </Link>
      <Link to="/signup" className="text-blue-400 text-sm text-center">
        Don't have an account? Sign Up
      </Link>
    </form>
  );
}
