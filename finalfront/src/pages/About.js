import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Utensils, Calculator, Heart } from 'lucide-react';
import "../styles/About.css"; // ✅ Add styles in a separate file

export default function About() {
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
    <div className="about-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center about-header"
      >
        <h1 className="about-title">About Precise Baking</h1>
        <p className="about-subtitle">
          Helping bakers achieve perfect results through precise measurements.
        </p>
      </motion.div>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="feature-card"
          >
            <div className="feature-header">
              <feature.icon className="feature-icon" />
              <h2 className="feature-title">{feature.title}</h2>
            </div>
            <p className="feature-text">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="about-image-section"
      >
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Professional Baking"
          className="about-image"
        />
        <p className="about-image-text">
          Whether you're a professional baker or a home cooking enthusiast, 
          precise measurements ensure consistent, delicious results.
        </p>
      </motion.div>
    </div>
  );
}
