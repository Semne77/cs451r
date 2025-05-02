import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import RecoveryPage from "./pages/RecoveryPage"; // ✅ Add this
import { Routes, Route } from "react-router-dom";




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/transactionsPage/:id" element={<Transactions />} />
        <Route path="/goalsPage/:id" element={<Goals />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/settings/:id" element={<Settings />} />
        <Route path="/recovery" element={<RecoveryPage />} /> {/* ✅ Add this */}

      </Routes>
    </>
  );
}

export default App;
