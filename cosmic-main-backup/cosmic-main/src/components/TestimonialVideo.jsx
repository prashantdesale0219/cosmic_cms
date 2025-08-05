import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Switching to solar with Cosmic Powertech was the best decision for our home. The installation was quick and professional, and we\'ve seen significant savings on our electricity bills.',
    productImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    productName: 'Residential Solar System',
    discount: '60% OFF',
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'As a business owner, I was looking for sustainable energy solutions. Cosmic Powertech provided an excellent commercial solar setup that has reduced our operational costs significantly.',
    productImage: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=800&q=80',
    productName: 'Commercial Solar System',
    discount: '42% OFF',
  },
  {
    id: 3,
    name: 'Anita Desai',
    role: 'Apartment Resident',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'I was skeptical about installing solar in my apartment, but Cosmic Powertech made it possible with their innovative solutions. The service was impeccable and the results are amazing.',
    productImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    productName: 'Apartment Solar Solution',
    discount: '50% OFF',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Farm Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'My agricultural farm now runs entirely on solar power thanks to Cosmic Powertech. Their team understood our specific needs and delivered a perfect solution.',
    productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    productName: 'Agricultural Solar System',
    discount: '55% OFF',
  },
  {
    id: 5,
    name: 'Meera Kapoor',
    role: 'School Principal',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Our school wanted to teach sustainability by example. Cosmic Powertech helped us install a comprehensive solar system that not only powers our campus but also serves as an educational tool for our students.',
    productImage: 'https://images.unsplash.com/photo-1566832512884-a1770ad0993b?auto=format&fit=crop&w=800&q=80',
    productName: 'Educational Institution Setup',
    discount: '48% OFF',
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    role: 'IT Professional',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'The smart home integration with my solar system from Cosmic Powertech is fantastic. I can monitor energy production and consumption right from my phone.',
    productImage: 'https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80',
    productName: 'Smart Solar Integration',
    discount: '56% OFF',
  },
];

const TestimonialVideo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Auto-advance testimonials
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 8000); // Change testimonial every 8 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);
  
  // Ensure video is always playing
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      video.play().catch(error => {
        console.error("Video play failed:", error);
      });
      
      // Add event listener for when video ends
      const handleVideoEnded = () => {
        video.play();
      };
      
      video.addEventListener('ended', handleVideoEnded);
      
      return () => {
        video.removeEventListener('ended', handleVideoEnded);
      };
    }
  }, []);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    // Reset the auto-advance timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 8000);
    }
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    // Reset the auto-advance timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 8000);
    }
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="w-full py-16 bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-green-900 leading-tight">
            WATCH AND BUY
          </h2>
        </div>
        
        <div className="relative">
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 opacity-10">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Testimonial Section */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-8 shadow-lg"
                >
                  <div className="flex items-start mb-6">
                    <FaQuoteLeft className="text-yellow-green-500 text-4xl mr-4 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg italic">{currentTestimonial.quote}</p>
                    <FaQuoteRight className="text-yellow-green-500 text-4xl ml-4 flex-shrink-0 mt-1" />
                  </div>
                  
                  <div className="flex items-center">
                    <img 
                      src={currentTestimonial.image} 
                      alt={currentTestimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{currentTestimonial.name}</h4>
                      <p className="text-yellow-green-600">{currentTestimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex justify-center mt-6 space-x-4">
                  <button 
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-yellow-green-500 text-white hover:bg-yellow-green-600 transition-colors"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-yellow-green-500 text-white hover:bg-yellow-green-600 transition-colors"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Product Display Section */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonials.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: { delay: index * 0.1 }
                      }}
                      className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ${currentIndex === index ? 'ring-4 ring-yellow-green-500' : ''}`}
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {item.discount}
                      </div>
                      
                      {/* Views Counter */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {Math.floor(Math.random() * 30) + 10}
                      </div>
                      
                      {/* Product Image */}
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4 bg-white">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 h-10">
                          {item.productName}
                        </h3>
                        
                        <div className="flex justify-between items-center mt-2">
                          <button 
                            onClick={() => setCurrentIndex(index)}
                            className="text-xs bg-yellow-green-500 hover:bg-yellow-green-600 text-white px-3 py-1 rounded transition-colors"
                          >
                            View Details
                          </button>
                          
                          <button className="text-xs border border-yellow-green-500 text-yellow-green-600 hover:bg-yellow-green-50 px-3 py-1 rounded transition-colors">
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialVideo;