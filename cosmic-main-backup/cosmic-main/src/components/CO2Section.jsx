// src/components/CO2Section.jsx
import { useState, useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { co2EmissionReductionService } from '../services/api';

export default function CO2Section() {
  const [co2Data, setCO2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCO2Data = async () => {
      try {
        setLoading(true);
        const response = await co2EmissionReductionService.getActiveReductions();
        if (response.data && response.data.data && response.data.data.length > 0) {
          setCO2Data(response.data.data[0]); // Get the first active CO2 emission reduction entry
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CO2 emission reduction data:', err);
        setError('Failed to load CO2 emission reduction data');
        setLoading(false);
      }
    };

    fetchCO2Data();
  }, []);
  // Show loading state
  if (loading) {
    return (
      <section className="w-full bg-transparent py-8 sm:py-10 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-6 text-center">
          <p>Loading CO2 emission reduction data...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full bg-transparent py-8 sm:py-10 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // Show default content if no data is available
  if (!co2Data) {
    return (
      <section className="w-full bg-transparent py-8 sm:py-10 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-6 text-center">
          <p>No CO2 emission reduction data available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-transparent py-8 sm:py-10 md:py-16">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center px-4 sm:px-6 md:px-6">
        {/* Left Image Column */}
        <div className="order-2 md:order-1 col-span-12 md:col-span-7 flex justify-center md:justify-start overflow-hidden">
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             viewport={{ once: true, amount: 0.3 }}
             className="relative w-full h-full rounded-xl overflow-hidden"
           >
             <motion.img
               src={co2Data.image || "/co2emission.png"}
               alt={co2Data.title || "Solar Energy Solutions"}
               className="w-full h-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px] rounded-xl object-cover"
               initial={{ scale: 1, x: 0 }}
               animate={{ 
                 x: [0, -10, 10, -5, 5, 0],
                 scale: [1, 1.02, 1, 1.01, 1]
               }}
               transition={{ 
                 x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                 scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
               }}
               whileHover={{ scale: 1.05 }}
             />
           </motion.div>
        </div>
        {/* Right Content Column */}
        <div className="order-1 md:order-2 col-span-12 md:col-span-5 px-4 md:px-0 mb-6 md:mb-0">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-[1rem] sm:text-[1.1rem] md:text-[1.3rem] font-medium mb-2 flex items-center text-black font-space-grotesk">
            <span className="text-[0.7rem] sm:text-[0.8rem] mx-1">★</span>
            Intelligent Solution
            <span className="text-[0.7rem] sm:text-[0.8rem] mx-1">★</span>
          </motion.p>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-[1.8rem] sm:text-[2.2rem] md:text-[3.5rem] font-bold text-black leading-tight sm:leading-snug mb-3 sm:mb-4 font-space-grotesk">
            {co2Data.title || "CO2 Emission Reduction"}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] leading-relaxed text-black mb-5 sm:mb-6">
            {co2Data.description || "Transform Your Energy Use – Reduce CO₂, Restore Nature"}
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 sm:gap-2 px-5 py-2.5 sm:px-6 md:px-8 sm:py-3 rounded-full bg-[#CAE28E] hover:bg-[#b9d275] text-black font-semibold text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] transition-shadow shadow-md">
            Discover Solar
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  )
}
