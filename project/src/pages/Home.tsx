import React from 'react';
import { motion } from 'framer-motion';
import ConversionForm from '../components/ConversionForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Perfect Measurements, Every Time
          </h1>
          <p className="text-xl text-gray-600">
            Convert your recipes to precise gram measurements for consistent, professional results
          </p>
        </motion.div>
        
        <ConversionForm />
      </div>
    </div>
  );
}