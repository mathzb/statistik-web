import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Support from "./components/Support.jsx";
import Home from "./components/Home.jsx";
import Opstart from "./components/Opstart.jsx";
import Sekretærservice from "./components/Sekretærservice.jsx";
import Callcenter from "./components/Callcenter.jsx";
import Whitelabels from "./components/Whitelabels.jsx";

function App() {
  console.log('Ny version')
  return (
    <Router>
      <Routes>
        <Route path="/support" element={<Support />} />
        <Route path="/opstart" element={<Opstart />} />
        <Route path="/sekretærservice" element={<Sekretærservice />} />
        <Route path="/callcenter" element={<Callcenter />} />
        <Route path="/whitelabels" element={<Whitelabels />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
