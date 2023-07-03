import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Support from "./components/Support.jsx";
import Home from "./components/Home.jsx";
import Opstart from "./components/Opstart.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/support" element={<Support />} />
        <Route path="/opstart" element={<Opstart />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
