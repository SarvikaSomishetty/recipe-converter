import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-4xl mx-auto px-6 py-4 text-center text-gray-600">
            Built with ❤️ for professional bakers and cooking enthusiasts
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;