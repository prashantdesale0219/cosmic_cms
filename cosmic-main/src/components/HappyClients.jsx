import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaProjectDiagram, FaSolarPanel, FaBolt } from 'react-icons/fa';
import { happyClientService } from '../services/api';

// Default company stats data for the Happy Clients section (will be replaced with data from API)
const defaultCompanyStats = [
  {
    id: 1,
    value: 30,
    label: 'Years of Experience',
    icon: FaUsers,
    color: '#9fc22f',
    suffix: '+',
    animationDelay: 0
  },
  {
    id: 2,
    value: 10000,
    label: 'Successful Projects',
    icon: FaProjectDiagram,
    color: 'rgb(28 155 231)',
    suffix: '+',
    animationDelay: 0.2
  },
  {
    id: 3,
    value: 2,
    label: 'Modules Shipped',
    icon: FaSolarPanel,
    color: '#9fc22f',
    suffix: 'M+',
    animationDelay: 0.4
  },
  {
    id: 4,
    value: 1.5,
    label: 'PV Modules Manufacturing Capacity',
    icon: FaBolt,
    color: 'rgb(28 155 231)',
    suffix: 'GW',
    description: '+2.5 GW Under Development',
    animationDelay: 0.6
  }
];

const HappyClients = ({ ...props }) => {
  const [companyStats, setCompanyStats] = useState(defaultCompanyStats);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const companyVideoRef = useRef(null);
  
  // Fetch company stats from happy clients API
  useEffect(() => {
    const fetchCompanyStats = async () => {
      try {
        setLoading(true);
        const response = await happyClientService.getActiveHappyClient();
        
        if (response.data && response.data.success && response.data.data) {
          const happyClientData = response.data.data;
          
          // Check if we have stats data
          if (happyClientData.stats && happyClientData.stats.length > 0) {
            // Map API stats to component format
            const statsFromAPI = happyClientData.stats
              .sort((a, b) => a.order - b.order) // Sort by order
              .map((stat, index) => {
                // Map icon string to actual icon component
                let IconComponent;
                switch(stat.icon) {
                  case 'FaUsers': IconComponent = FaUsers; break;
                  case 'FaProjectDiagram': IconComponent = FaProjectDiagram; break;
                  case 'FaSolarPanel': IconComponent = FaSolarPanel; break;
                  case 'FaBolt': IconComponent = FaBolt; break;
                  default: IconComponent = defaultCompanyStats[index % defaultCompanyStats.length].icon;
                }
                
                return {
                  id: stat._id || index + 1,
                  value: stat.value,
                  label: stat.label,
                  icon: IconComponent,
                  color: stat.color || defaultCompanyStats[index % defaultCompanyStats.length].color,
                  suffix: stat.suffix || '+',
                  description: stat.description || null,
                  animationDelay: index * 0.2
                };
              });
            
            setCompanyStats(statsFromAPI);
            setAnimatedValues(statsFromAPI.map(() => 0));
          }
          
          // Update video references if provided
          if (happyClientData.backgroundVideo && videoRef.current) {
            videoRef.current.src = happyClientData.backgroundVideo;
          }
          
          if (happyClientData.companyVideo && companyVideoRef.current) {
            companyVideoRef.current.src = happyClientData.companyVideo;
          }
        } else {
          // If no data or error, use defaults
          console.log('No happy client data found, using defaults');
          setCompanyStats(defaultCompanyStats);
          setAnimatedValues(defaultCompanyStats.map(() => 0));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company stats:', err);
        setError('Failed to load company statistics');
        setLoading(false);
      }
    };
    
    fetchCompanyStats();
  }, []);
  
  // Handle counter animation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || hasAnimated) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        setHasAnimated(true);
        
        companyStats.forEach((stat, index) => {
          const targetValue = stat.value;
          const duration = 2000; // 2 seconds for animation
          const frameDuration = 1000 / 60; // 60fps
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;
          
          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = easeOutQuad(progress) * targetValue;
            
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = currentValue;
              return newValues;
            });
            
            if (frame === totalFrames) {
              clearInterval(counter);
            }
          }, frameDuration);
        });
      }
    };
    
    // Easing function for smoother animation
    const easeOutQuad = t => t * (2 - t);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated, companyStats]);
  
  // Ensure background video is always playing
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // Store the play promise to handle it properly
      let playPromise;
      let isPlayAttemptInProgress = false;
      
      const playVideo = () => {
        // Check if video element still exists in DOM
        if (!videoRef.current || isPlayAttemptInProgress) return;
        
        isPlayAttemptInProgress = true;
        playPromise = videoRef.current.play()
          .then(() => {
            isPlayAttemptInProgress = false;
          })
          .catch(error => {
            isPlayAttemptInProgress = false;
            // Only log error if it's not an AbortError (which happens when video is removed from DOM)
            if (error.name !== 'AbortError') {
              console.error("Background video play failed:", error);
            }
          });
      };
      
      // Initial play attempt with delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        playVideo();
      }, 100);
      
      // Add event listener for when video ends
      const handleVideoEnded = () => {
        // Check if video element still exists before playing
        if (videoRef.current) {
          playVideo();
        }
      };
      
      video.addEventListener('ended', handleVideoEnded);
      
      return () => {
        clearTimeout(timeoutId);
        if (videoRef.current) {
          videoRef.current.removeEventListener('ended', handleVideoEnded);
        }
      };
    }
  }, []);
  
  // Ensure company video is always playing
  useEffect(() => {
    const video = companyVideoRef.current;
    
    if (video) {
      // Store the play promise to handle it properly
      let playPromise;
      let isPlayAttemptInProgress = false;
      
      const playVideo = () => {
        // Check if video element still exists in DOM
        if (!companyVideoRef.current || isPlayAttemptInProgress) return;
        
        isPlayAttemptInProgress = true;
        playPromise = companyVideoRef.current.play()
          .then(() => {
            isPlayAttemptInProgress = false;
          })
          .catch(error => {
            isPlayAttemptInProgress = false;
            // Only log error if it's not an AbortError (which happens when video is removed from DOM)
            if (error.name !== 'AbortError') {
              console.error("Company video play failed:", error);
            }
          });
      };
      
      // Initial play attempt with delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        playVideo();
      }, 100);
      
      // Add event listener for when video ends
      const handleVideoEnded = () => {
        // Check if video element still exists before playing
        if (companyVideoRef.current) {
          playVideo();
        }
      };
      
      video.addEventListener('ended', handleVideoEnded);
      
      return () => {
        clearTimeout(timeoutId);
        if (companyVideoRef.current) {
          companyVideoRef.current.removeEventListener('ended', handleVideoEnded);
        }
      };
    }
  }, []);
  
  return (
    <section ref={sectionRef} className="w-full py-12 bg-gray-800 overflow-hidden" {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest text-[#9fc22f] font-semibold mb-2"
          >
            About Solex Energy Limited
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight font-space-grotesk"
          >
            Happy Clients
          </motion.h2>
        </div>
        
        <div className="relative">
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 opacity-20">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/solar-installation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="relative z-10">
            {/* Company Introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <video 
                    ref={companyVideoRef}
                    src="/enn.mp4" 
                    alt="Solex Energy 30 Years" 
                    className="w-full h-auto rounded-lg shadow-md"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </motion.div>
              </div>
              
              <div className="lg:col-span-7 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-white font-space-grotesk">At Solex Energy Limited</h3>
                  <p className="text-gray-300">
                    We are dedicated to leading the renewable energy sector by harnessing the power of solar to build a greener world. Specializing in sustainable, cost-effective solutions for residential, commercial, and industrial clients, we combine innovation with advanced technologies to drive global zero-carbon development. As a trusted partner in clean energy, we are committed to paving the way for a sustainable future.
                  </p>
                </motion.div>
              </div>
            </div>
            
            {/* Stats Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {companyStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.animationDelay }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 text-center relative overflow-hidden group border border-gray-700"
                >
                  {/* Background circle decoration */}
                  <div 
                    className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10 transition-all duration-500 group-hover:scale-125"
                    style={{ backgroundColor: stat.color }}
                  />
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: stat.color }}
                    >
                      <stat.icon size={22} />
                    </div>
                  </div>
                  
                  {/* Counter */}
                  <div className="mb-1 flex items-center justify-center">
                    <h3 className="text-3xl font-bold" style={{ color: stat.color }}>
                      {stat.id === 3 || stat.id === 4 
                        ? animatedValues[index].toFixed(1) 
                        : Math.round(animatedValues[index])}
                    </h3>
                    <span className="text-xl font-bold ml-1" style={{ color: stat.color }}>
                      {stat.suffix}
                    </span>
                  </div>
                  
                  {/* Label */}
                  <p className="text-gray-300 font-medium text-sm">{stat.label}</p>
                  
                  {/* Description (if any) */}
                  {stat.description && (
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  )}
                  
                  {/* Animated border effect */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                    initial={{ width: '0%', x: '-100%' }}
                    animate={{ 
                      width: '100%', 
                      x: ['-100%', '100%'],
                      transition: { 
                        x: { repeat: Infinity, duration: 2, ease: 'linear' },
                        width: { duration: 0.4 }
                      }
                    }}
                    style={{ backgroundColor: stat.color }}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* CTA Button */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <a 
                href="/about" 
                className="inline-flex items-center px-5 py-2 bg-[#9fc22f] text-black font-semibold rounded-full hover:bg-[#8db327] transition-colors shadow-md hover:shadow-lg group text-sm"
              >
                <span>Learn More About Us</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
      `}} />
    </section>
  );
};

export default HappyClients;