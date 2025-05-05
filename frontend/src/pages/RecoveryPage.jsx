import React, { useState } from 'react';

function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setMessage('Recovery email sent successfully.');
      } else {
        setMessage('Failed to send recovery email.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Account Recovery</h1>
      <p className="mb-4">Enter your email address, and we'll send you instructions to reset your password.</p>
      <form onSubmit={handleSubmit} className="flex flex-col w-80 gap-4">
        <input
          type="email"
          placeholder="Email address"
          className="p-2 rounded-md bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send Recovery Email
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}

export default RecoveryPage;
