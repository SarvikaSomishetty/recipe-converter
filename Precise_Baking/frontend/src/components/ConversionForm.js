import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Scale, Search, X, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const weightUnits = ['g', 'kg', 'oz', 'lb'];
const volumeUnits = ['ml', 'liter', 'tsp', 'tbsp', 'cup', 'glass'];
const allUnits = [...weightUnits, ...volumeUnits];

const ConversionForm = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('g');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/foods`);
        setIngredients(response.data);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        setError('Failed to load ingredients');
      }
    };
    fetchIngredients();
  }, []);

  // Normalize text
  const normalizeText = (text) => 
    text ? text.toLowerCase().replace(/[\s,./-]/g, "") : "";

  const filteredIngredients = searchTerm
    ? ingredients
        .filter(item => typeof item === 'string')
        .filter(item => normalizeText(item).includes(normalizeText(searchTerm)))
    : [];

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Conversion handler
  const handleConvert = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!selectedIngredient || !amount) {
      setError("Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/convert`, {
        food: selectedIngredient,
        quantity: parseFloat(amount),
        from_unit: fromUnit,
        to_unit: toUnit,
      });

      setResult({
        input: `${amount} ${fromUnit}`,
        output: response.data.output,
        ingredient: selectedIngredient
      });
    } catch (err) {
      setError(err.response?.data?.error || "Conversion failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 my-8">
        <form onSubmit={handleConvert} className="space-y-4">
          {/* Search Section */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="block text-sm font-medium text-pink-700 sm:text-base">
              🔍 What's cooking today?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-pink-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setSelectedIngredient(e.target.value);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search ingredient..."
                className="block w-full pl-10 pr-10 py-2 border border-pink-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedIngredient('');
                    setShowSuggestions(false);
                  }}
                >
                  <X className="h-5 w-5 text-pink-400" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredIngredients.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredIngredients.map((item, index) => (
                  <div
                    key={index}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 text-pink-900 hover:bg-pink-50"
                    onClick={() => {
                      setSelectedIngredient(item);
                      setSearchTerm(item);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="block truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amount and Units Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-pink-700 sm:text-base">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.25"
                min="0"
                className="block w-full rounded-lg border border-pink-300 py-2 px-3 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              />
            </div>

            {/* From Unit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-pink-700 sm:text-base">
                From Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="block w-full rounded-lg border border-pink-300 py-2 px-3 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              >
                {allUnits.map(unit => (
                  <option key={`from-${unit}`} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* To Unit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-pink-700 sm:text-base">
                To Unit
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="block w-full rounded-lg border border-pink-300 py-2 px-3 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              >
                {allUnits.map(unit => (
                  <option key={`to-${unit}`} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Convert Button */}
          <div className="pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full justify-center rounded-lg bg-pink-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:text-base"
              disabled={isLoading}
            >
              <Scale className="mr-2 h-5 w-5" />
              {isLoading ? 'Converting...' : `Convert to ${toUnit}`}
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
        </form>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-lg bg-pink-50 p-6 shadow-inner"
          >
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-pink-600" />
              <h3 className="text-lg font-medium text-pink-800">Conversion Result</h3>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-pink-700">
                {result.input} of {result.ingredient}
              </p>
              <p className="text-xl font-bold text-pink-800">
                = {result.output}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    
  );
};

export default ConversionForm;