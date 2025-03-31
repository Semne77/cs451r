// src/pages/Dashboard.tsx
import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top summary section */}
      <div className="bg-gray-800 text-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-200 text-black p-4 rounded-md">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p className="text-2xl font-bold">$500</p>
        </div>
        <div className="bg-gray-200 text-black p-4 rounded-md border-2 border-blue-400">
          <h2 className="text-lg font-semibold">Total Spendings</h2>
          <p className="text-2xl font-bold">$500</p>
        </div>
        <div className="bg-gray-200 text-black p-4 rounded-md">
          <h2 className="text-lg font-semibold">Total Balance</h2>
          <p className="text-2xl font-bold">$500</p>
        </div>
      </div>

      {/* Time Period selector (placeholder) */}
      <div className="bg-gray-300 rounded-md p-2 text-center font-medium">
        Time Period
      </div>

      {/* Middle section: chart + latest transactions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart placeholder */}
        <div className="md:col-span-2 bg-gray-200 rounded-md p-4">
          <h3 className="text-center font-semibold mb-2">Spending Chart</h3>
          <div className="h-48 bg-blue-600 rounded-md flex items-end justify-around p-2">
            {/* Simple fake bars */}
            {[80, 50, 65, 90, 60, 85, 85].map((h, i) => (
              <div key={i} className="bg-blue-400 w-6" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-around text-sm text-gray-700 mt-2">
            {['03/24', '03/24', '03/24', '03/24', '03/24', '03/24', '03/24'].map((date, i) => (
              <span key={i}>{date}</span>
            ))}
          </div>
        </div>

        {/* Latest transactions */}
        <div className="bg-gray-100 rounded-md p-4">
          <h3 className="font-semibold text-lg mb-2">Latest Transactions</h3>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex justify-between bg-gray-300 px-3 py-2 rounded-md">
                <span>03/24/25</span>
                <span className="text-red-600">-$54</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;