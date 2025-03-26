import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Utensils, Calculator, Heart } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Scale,
      title: "Precise Measurements",
      description: "Convert traditional measurements to exact gram weights for perfect results every time."
    },
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Precise Baking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're passionate about helping bakers achieve perfect results through precise measurements
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">{feature.title}</h2>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Professional Baking"
            className="rounded-xl shadow-lg mx-auto mb-8"
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you're a professional baker or a home cooking enthusiast, precise measurements
            are the key to consistent, delicious results. Our tool helps you achieve professional-grade
            accuracy in your recipes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}