// src/components/ui/Sidebar.tsx
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-[#4a475a] text-white flex flex-col justify-between py-6 px-4">
      {/* Top: App Name + Nav */}
      <div>
        <h1 className="text-xl font-bold mb-8">Budget App</h1>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block bg-gray-200 text-black rounded px-3 py-2 hover:bg-gray-300"
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className="block bg-gray-200 text-black rounded px-3 py-2 hover:bg-gray-300"
          >
            Transactions
          </Link>
          <Link
            to="/add"
            className="block bg-gray-200 text-black rounded px-3 py-2 hover:bg-gray-300"
          >
            Add Transaction
          </Link>
          <Link
            to="/categories"
            className="block bg-gray-200 text-black rounded px-3 py-2 hover:bg-gray-300"
          >
            Categories
          </Link>
        </nav>
      </div>

      {/* Bottom: Logout */}
      <button className="bg-gray-200 text-black rounded px-3 py-2 hover:bg-gray-300">
        Log out
      </button>
    </div>
  );
};

export default Sidebar;
