import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registration successful!");
        navigate("/"); // Redirect to login or homepage
      } else {
        const errorData = await res.text();
        alert(`Registration failed: ${errorData}`);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Create an Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          name="firstName"
          placeholder="First Name"
          className="p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          className="p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
