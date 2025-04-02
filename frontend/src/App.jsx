import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp"
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/dashboard/:id" element={<Dashboard />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
      </Routes >
    </>
  )
}

export default App
