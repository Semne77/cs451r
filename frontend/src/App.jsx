import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/dashboard/:id" element={<Dashboard />}></Route>
        <Route path="/transactionsPage/:id" element={<Transactions />}></Route>
        <Route path="/goalsPage/:id" element={<Goals />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/settings/:id" element={<Settings />}></Route>
      </Routes >
    </>
  )
}

export default App
