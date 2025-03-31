import { useState } from 'react';

const AddTransaction = () => {
  const [category, setCategory] = useState('');
  const [secondParty, setSecondParty] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction = {
      category,
      secondParty,
      amount: parseFloat(amount),
      date,
    };

    console.log('✅ Transaction added:', newTransaction);

    // Reset form
    setCategory('');
    setSecondParty('');
    setAmount('');
    setDate('');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-6 space-y-4"
      >
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Groceries, Salary"
            required
          />
        </div>

        {/* Second Party */}
        <div>
          <label className="block text-sm font-medium mb-1">Second Party</label>
          <input
            type="text"
            value={secondParty}
            onChange={(e) => setSecondParty(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Walmart, Work Inc"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Use negative for spending, positive for income"
            required
          />
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
