import React, { useState, useEffect } from 'react';
import { Scale, ChefHat, Search, Sparkles } from 'lucide-react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';

interface IngredientType {
  "Food name and description": string;
  "Density in g/ml": number;
  is_liquid: boolean;
}

interface ConversionResult {
  ingredient: string;
  amount: number;
  measurement: string;
  grams: number;
}

export default function ConversionForm() {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState('1');
  const [measurement, setMeasurement] = useState<string>('cups');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch('/Densities.json')
      .then(response => response.json())
      .then(data => {
        setIngredients(data);
        setCurrentIngredient(data[0]?.["Food name and description"] || '');
      })
      .catch(error => console.error("Error loading JSON:", error));
  }, []);

  const fuse = new Fuse(ingredients.map(ing => ing["Food name and description"]), {
    threshold: 0.4,
    distance: 100,
  });

  const suggestions = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : [];

  const calculateGrams = () => {
    const selectedIngredient = ingredients.find(ing => ing["Food name and description"] === currentIngredient);
    if (!selectedIngredient) return;

    const density = selectedIngredient["Density in g/ml"];
    const conversionFactor = measurement === "cups" ? 1 : 0.5; // Example, adjust for real conversion
    const grams = density * parseFloat(amount) * conversionFactor;

    const newResult: ConversionResult = {
      ingredient: currentIngredient,
      amount: parseFloat(amount),
      measurement,
      grams: Math.round(grams * 100) / 100
    };

    setResults(prev => [newResult, ...prev]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateGrams();
  };

  const handleIngredientSelect = (ingredient: string) => {
    setCurrentIngredient(ingredient);
    setSearchTerm(ingredient);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-8 mb-8 relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Ingredient</label>
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
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                    {suggestions.map((ingredient) => (
                      <motion.button key={ingredient} type="button" onClick={() => handleIngredientSelect(ingredient)} className="w-full text-left px-4 py-2 hover:bg-blue-50">
                        {ingredient}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg">Convert to Grams</motion.button>
        </form>
      </motion.div>
    </div>
  );
}
