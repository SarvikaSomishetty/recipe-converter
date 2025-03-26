import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scale, Home, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import "../styles/Navbar.css";  // ✅ Import the CSS file

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ Logo */}
        <motion.div 
          className="navbar-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Scale className="w-8 h-8" />
          <span>Precise Baking</span>
        </motion.div>

        {/* ✅ Navigation Links */}
        <motion.div 
          className="navbar-links"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
            <Info className="w-5 h-5" />
            <span>About</span>
          </NavLink>
        </motion.div>
      </div>
    </nav>
  );
}
