import React from 'react';
import { motion } from 'framer-motion';
import { CakeSlice, Sparkles } from 'lucide-react';
import ConversionForm from '../components/ConversionForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-pattern">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          {/* Decorative elements */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-4 -left-4 text-blue-200 opacity-50"
          >
            <Sparkles size={32} />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-4 -right-4 text-pink-200 opacity-50"
          >
            <CakeSlice size={32} />
          </motion.div>

          <motion.h1 
            className="text-5xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Perfect Measurements, Every Time
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Convert your recipes to precise gram measurements for consistent, professional results
          </motion.p>

          <motion.img
            src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Baking Ingredients"
            className="w-full h-48 object-cover rounded-2xl mt-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          />
        </motion.div>
        
        <ConversionForm />

        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Perfect Results"
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Perfect Results</h3>
            <p className="text-gray-600">Achieve professional-quality baking with precise measurements</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <img 
              src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Easy Conversion"
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Easy Conversion</h3>
            <p className="text-gray-600">Convert any recipe measurement with just a few clicks</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <img 
              src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Professional Tools"
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Professional Tools</h3>
            <p className="text-gray-600">Built for both home bakers and professionals</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}