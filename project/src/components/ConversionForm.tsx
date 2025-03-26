import React, { useState, useEffect } from "react";
import { Scale, ChefHat, Search } from "lucide-react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config"; // Backend API base URL

export default function ConversionForm() {
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [amount, setAmount] = useState("1");
  const [measurement, setMeasurement] = useState("cup");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Fetch food list from backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/foods`)
      .then((res) => res.json())
      .then((data) => setFoodList(data))
      .catch((err) => console.error("Error fetching foods:", err));
  }, []);

  // Fuse.js for fuzzy search
  const fuse = new Fuse(foodList, {
    threshold: 0.4,
    distance: 100,
  });

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
      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food: currentIngredient,
          quantity: amount,
          unit: measurement,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResults((prev) => [
          {
            ingredient: currentIngredient,
            amount: parseFloat(amount),
            measurement,
            grams: data.value,
          },
          ...prev,
        ]);
      } else {
        setError(data.error || "Conversion failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <form onSubmit={handleConvert} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Ingredient
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                  placeholder="Type to search..."
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
                  >
                    {suggestions.map((ingredient, index) => (
                      <motion.button
                        key={ingredient}
                        type="button"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleIngredientSelect(ingredient)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {ingredient}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.125"
                  min="0"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measurement
                </label>
                <select
                  value={measurement}
                  onChange={(e) => setMeasurement(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="cup">Cup</option>
                  <option value="tablespoon">Tablespoon</option>
                  <option value="teaspoon">Teaspoon</option>
                  <option value="glass">Glass</option>
                </select>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Scale className="w-5 h-5" />
            Convert to Grams
          </motion.button>
        </form>
      </motion.div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-blue-600" />
              Conversion Results
            </h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <span className="font-medium">
                      {result.amount} {result.measurement} of {result.ingredient}
                    </span>
                  </div>
                  <div className="text-blue-600 font-bold">
                    {result.grams}g
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
