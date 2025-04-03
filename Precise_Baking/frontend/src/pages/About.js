import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Calculator, Heart, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Calculator,
      title: "Smart Conversions",
      description: "Intelligent conversion algorithms based on precise ingredient densities."
    },
    {
      icon: Utensils,
      title: "Professional Grade",
      description: "Built for professional bakers and cooking enthusiasts alike."
    },
    {
      icon: Heart,
      title: "User Friendly",
      description: "Simple, intuitive interface with smart search and instant results."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-8 text-pink-600 hover:text-pink-700 transition-colors"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <Home className="w-5 h-5" />
        <span className="text-sm sm:text-base">Back to Home</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-700 mb-2">
          About Precise Baking
        </h1>
        <p className="text-pink-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Helping bakers achieve perfect results through precise measurements.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <feature.icon className="w-8 h-8 text-pink-500" />
              <h2 className="text-lg sm:text-xl font-semibold text-pink-700">
                {feature.title}
              </h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg"
      >
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Professional Baking"
          className="w-full h-48 sm:h-64 md:h-80 object-cover"
        />
        <div className="bg-white p-4 sm:p-6">
          <p className="text-pink-700 text-center text-sm sm:text-base md:text-lg">
            Whether you're a professional baker or a home cooking enthusiast, 
            precise measurements ensure consistent, delicious results.💕
          </p>
        </div>
      </motion.div>
    </div>
  );
}