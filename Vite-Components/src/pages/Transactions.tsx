import { useState } from 'react';

const allTransactions = [
  {
    id: 1,
    type: 'expense',
    category: 'Groceries',
    secondParty: 'Walmart',
    amount: -54.0,
    date: '2025-03-25 14:43',
  },
  {
    id: 2,
    type: 'income',
    category: 'Salary',
    secondParty: 'Work Inc',
    amount: 1500.0,
    date: '2025-03-24 09:00',
  },
  {
    id: 3,
    type: 'expense',
    category: 'Transport',
    secondParty: 'Uber',
    amount: -20.0,
    date: '2025-03-24 12:30',
  },
  {
    id: 4,
    type: 'expense',
    category: 'Coffee',
    secondParty: 'Starbucks',
    amount: -5.0,
    date: '2025-03-24 08:15',
  },
  {
    id: 5,
    type: 'income',
    category: 'Freelance',
    secondParty: 'Client XYZ',
    amount: 300.0,
    date: '2025-03-23 18:00',
  },
  // Add more if needed to simulate a scroll
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const filteredTransactions = allTransactions.filter((tx) =>
    `${tx.category} ${tx.secondParty}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Transactions</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // reset to page 1 on new search
        }}
        className="mb-4 px-4 py-2 border border-gray-300 rounded w-full max-w-sm"
      />

      {/* Scrollable table container */}
      <div className="overflow-y-auto max-h-80 border rounded shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">With</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-center">Manage</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t hover:bg-gray-50 text-gray-700"
                >
                  <td className="p-3">{tx.category}</td>
                  <td className="p-3">{tx.secondParty}</td>
                  <td
                    className={`p-3 font-semibold ${
                      tx.amount < 0 ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {tx.amount < 0
                      ? `-$${Math.abs(tx.amount)}`
                      : `$${tx.amount}`}
                  </td>
                  <td className="p-3 text-gray-500">{tx.date}</td>
                  <td className="p-3 text-center space-x-2">
                    <button className="text-blue-600 hover:underline text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-end">
        {page * pageSize < filteredTransactions.length && (
          <button
            onClick={() => setPage(page + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  );
};

export default Transactions;
