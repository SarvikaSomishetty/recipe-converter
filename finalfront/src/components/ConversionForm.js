import React, { useState, useEffect } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { Scale, Search, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:5000/api";
const units = ["cup", "tablespoon", "teaspoon", "glass"];

const ConversionForm = ({ onConvert }) => {
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [amount, setAmount] = useState("1");
  const [measurement, setMeasurement] = useState("cup");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/foods`)
      .then((res) => setFoodList(res.data))
      .catch((err) => console.error("Error fetching foods:", err));
  }, []);

  const fuse = new Fuse(foodList, { threshold: 0.4, distance: 100 });
  const suggestions = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : [];

  const handleIngredientSelect = (ingredient) => {
    setCurrentIngredient(ingredient);
    setSearchTerm(ingredient);
    setShowSuggestions(false);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentIngredient || !amount || !measurement) {
      setError("Please enter all fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/convert`, {
        food: currentIngredient,
        quantity: amount,
        unit: measurement,
      });

      if (response.data) {
        setResults((prev) => [
          {
            ingredient: currentIngredient,
            amount: parseFloat(amount),
            measurement,
            grams: response.data.value,
          },
          ...prev,
        ]);

        onConvert(response.data);
      }
    } catch (err) {
      setError("Conversion failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 rounded-2xl shadow-lg">

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-pink-100 rounded-xl shadow-lg p-8 mb-8 border border-pink-200"
      >
        <form onSubmit={handleConvert} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            
              
              <div className="relative">
              <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 shadow-md focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Search..."
                />

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden"

                  >
                    {suggestions.map((ingredient, index) => (
                      <motion.button 
                        key={ingredient} 
                        type="button" 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: index * 0.05 }} 
                        onClick={() => handleIngredientSelect(ingredient)} 
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-pink-800"
                      >
                        {ingredient}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            

            {/* Amount & Measurement Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-pink-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.25"
                  min="0"
                  className="w-full rounded-lg border border-pink-300 shadow-sm focus:border-pink-500 focus:ring-pink-400 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-pink-700 mb-2">
                  Measurement
                </label>
                <select
                  value={measurement}
                  onChange={(e) => setMeasurement(e.target.value)}
                  className="w-full rounded-lg border border-pink-300 shadow-sm focus:border-pink-500 focus:ring-pink-400 py-2"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <motion.button 
            type="submit" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="convert-button"
          >
            <Scale className="w-5 h-5" />
            Convert to Grams
          </motion.button>
        </form>
      </motion.div>

      {/* Conversion Results Display */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="bg-white rounded-xl shadow-lg p-6 border border-pink-200"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-pink-700">
              <ChefHat className="w-6 h-6 text-pink-500" />
              Conversion Results
            </h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div 
                  key={index} 
                  className="p-5 bg-gray-100 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition-all"

                >
                  <span className="font-medium">
                    {result.amount} {result.measurement} of {result.ingredient}
                  </span>
                  <span className="text-pink-600 font-bold">
                    {result.grams}g
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default ConversionForm;
