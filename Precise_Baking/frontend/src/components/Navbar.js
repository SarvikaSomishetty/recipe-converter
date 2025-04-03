import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scale, Home, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="bg-pink-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Scale className="w-6 h-6 md:w-8 md:h-8 text-pink-600" />
            <span className="text-lg md:text-xl font-semibold text-pink-700">
              Precise Baking
            </span>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NavLink
              to="/"
              className={({ isActive }) => 
                `flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-pink-200 text-pink-700' 
                    : 'text-pink-600 hover:bg-pink-50'
                }`
              }
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Home</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => 
                `flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-pink-200 text-pink-700' 
                    : 'text-pink-600 hover:bg-pink-50'
                }`
              }
            >
              <Info className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">About</span>
            </NavLink>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}