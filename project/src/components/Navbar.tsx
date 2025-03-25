import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scale, Home, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Scale className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Precise Baking</h1>
          </motion.div>
          
          <motion.div 
            className="flex gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`
              }
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`
              }
            >
              <Info className="w-5 h-5" />
              <span>About</span>
            </NavLink>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
