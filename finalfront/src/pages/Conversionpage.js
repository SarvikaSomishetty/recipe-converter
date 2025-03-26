import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ConversionForm from "../components/ConversionForm"; 
import { motion } from "framer-motion"; 
import { Sparkles } from "lucide-react";
import "../styles/ConversionPage.css"; 

const featureCards = [
  { 
    text: "Baking is love made edible. 💕", 
    image: process.env.PUBLIC_URL + "/images/baking1.jpg" 
  },
  { 
    text: "The secret ingredient is always butter. 🧈", 
    image: process.env.PUBLIC_URL + "/images/baking2.png" 
  },
  { 
    text: "Bake the world a better place! 🍪", 
    image: process.env.PUBLIC_URL + "/images/baking3.jpg" 
  },
];

const ConversionPage = () => {
  const [conversionResult, setConversionResult] = useState(null);

  return (
    <div className="conversion-page">
      
      {/* ✅ Navbar */}
      <Navbar />

      
      {/* ✅ Conversion Form Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }} 
      >
        <ConversionForm onConvert={setConversionResult} />
      </motion.div>

      {/* ✅ Conversion Result Display */}
      {conversionResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="conversion-result"
        >
          <h3 className="result-title">
            <Sparkles className="icon" /> Conversion Result
          </h3>
          <p className="result-text">{conversionResult.result}</p>
        </motion.div>
      )}

      {/* ✅ Feature Cards */}
      <div className="feature-section">
        {featureCards.map((card, index) => (
          <motion.div 
            key={index} 
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.2 }}
          >
            <img src={card.image} alt={`Feature ${index + 1}`} />
            <p>{card.text}</p>
            
          </motion.div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-6 py-4 text-center text-gray-600">
            Built with ❤️ for professional bakers and cooking enthusiasts
          </div>
    </div>
  );
};

export default ConversionPage;
