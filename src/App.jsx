import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sales from "./components/Sales.jsx";
import Home from "./components/Home.jsx";
import Skade from "./components/Skade.jsx";
import Omstilling from "./components/Omstilling.jsx";
import Login from "./components/Login.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/salg" element={<Sales />} />
        <Route path="/skade" element={<Skade />} />
        <Route path="/omstilling" element={<Omstilling />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
