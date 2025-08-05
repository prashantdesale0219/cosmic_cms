import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const CTASection = () => {
  const [ctaData, setCtaData] = useState({
    title: 'Join Us in Our Solar Mission',
    description: 'Whether you\'re looking to power your home, business, or join our team, we invite you to be part of our journey towards a sustainable future.',
    primaryButton: {
      text: 'Contact Us',
      url: '/contact'
    },
    secondaryButton: {
      text: 'Join Our Team',
      url: '/careers'
    },
    backgroundColor: 'bg-primary-600'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCTAData();
  }, []);

  const fetchCTAData = async () => {
    try {
      const response = await axios.get('/api/director/cta');
      if (response.data.status === 'success' && response.data.data.cta) {
        setCtaData(response.data.data.cta);
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error);
      // Use default data if API fails
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto mb-8"></div>
            <div className="flex justify-center space-x-4">
              <div className="h-12 bg-white/20 rounded w-32"></div>
              <div className="h-12 bg-white/20 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${ctaData.backgroundColor || 'bg-primary-600'}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            {ctaData.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {ctaData.description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to={ctaData.primaryButton.url}
              className="group relative overflow-hidden bg-[#9fc22f] hover:bg-[#8fb028] text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-w-[160px]"
            >
              <span className="relative z-10">{ctaData.primaryButton.text}</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
            
            <Link
              to={ctaData.secondaryButton.url}
              className="group relative overflow-hidden border-2 border-white text-white hover:text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-w-[160px]"
            >
              <span className="relative z-10">{ctaData.secondaryButton.text}</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;