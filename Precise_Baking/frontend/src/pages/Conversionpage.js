import React from "react";
import "../styles/ConversionPage.css";
import Navbar from "../components/Navbar";
import ConversionForm from "../components/ConversionForm"; 
import { motion } from "framer-motion";

const featureCards = [
  { 
    text: "Baking is love made edible. 💕", 
    image: "https://images.pexels.com/photos/1184265/pexels-photo-1184265.jpeg?cs=srgb&dl=food-sugar-flour-1184265.jpg&fm=jpg"
  },
  { 
    text: "The secret ingredient is always butter. 🧈", 
    image: "https://i.pinimg.com/736x/37/f8/2c/37f82c36d8863210a4c4751d23eb360a.jpg" 
  },
  { 
    text: "Bake the world a better place! 🍪", 
    image: "https://i.pinimg.com/originals/7e/13/46/7e1346cdf6ea05eb0585a2b8600f0278.jpg" 
  },
];

const ConversionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">
  <div className="relative z-10">
    <Navbar />
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <ConversionForm />
    </motion.div>
        {/* Cute boxed section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: -10 }}
          transition={{ 
            delay: 1,
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
          className="cute-box mx-auto w-full max-w-[95vw] md:max-w-[700px] lg:max-w-[900px]"
        >
          <h2 className="cute-box-title text-xl sm:text-2xl md:text-3xl">
            🍰 Welcome to Precise Baking! 🎂
          </h2>
          <p className="cute-box-text text-sm sm:text-base md:text-lg">
            A place where baking meets precision. No more guessing or messy conversions—just perfect, fluffy cakes and crispy cookies every time! 🧁✨
          </p>
          <p className="cute-box-text text-sm sm:text-base md:text-lg">
            Whether you're a pro baker or just starting out, we've got you covered with smart, foolproof measurements! 🍪
          </p>
        </motion.div>
        <div className="grid w-full grid-cols-1 min-[400px]:grid-cols-2 min-[700px]:grid-cols-3 gap-5">
          {featureCards.map((card, index) => (
            <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow float-animate"
            >
              <img 
                src={card.image} 
                alt={`Feature ${index + 1}`} 
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <p className="text-lg text-pink-800">{card.text}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-pink-600">
          Built with ❤️ for professional bakers and cooking enthusiasts
        </div>
      </div>
    </div>
  );
};

export default ConversionPage;