import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConversionPage from './pages/Conversionpage'; // Note capitalization
import About from './pages/About';
import './index.css';  // Must be in your App.js

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<ConversionPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;