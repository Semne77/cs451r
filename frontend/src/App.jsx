import Landing from "./components/Landing"
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/home" element={<Home />}></Route>

      </Routes >
    </>
  )
}

export default App
