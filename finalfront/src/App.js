import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConversionPage from "./pages/Conversionpage.js"; // ✅ Integrated page
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConversionPage />} /> {/* ✅ Default Page */}
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
