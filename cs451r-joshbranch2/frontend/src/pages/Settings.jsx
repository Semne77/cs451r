import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function SettingsPage() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = window.location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:8080/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const userId = window.location.pathname.split('/').pop();
      await axios.put(`http://localhost:8080/users/${userId}`, userData);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = window.location.pathname.split('/').pop();
      await axios.delete(`http://localhost:8080/users/delete/${userId}`);
      alert('Account deleted successfully!');
      window.location.href = '/'; // Redirect after deletion
    } catch (error) {
      console.error('Error deleting account', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col p-8 w-full">
        <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>

        <input
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
          type="text"
          name="firstName"
          value={userData.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
          type="text"
          name="lastName"
          value={userData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          className="w-full p-2 mb-6 rounded bg-gray-800 text-white"
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
