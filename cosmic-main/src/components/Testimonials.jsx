import React, { useState, useEffect, useRef } from 'react';
import { FaQuoteLeft, FaQuoteRight, FaStar } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

/* ---------------- FALLBACK TESTIMONIALS DATA ---------------- */
const fallbackTestimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    role: "Factory Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "encompasses information about harnessing the sun's power,\nprimarily through photovoltaic (PV) and\nsolar thermal technologies",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "The solar installation has significantly reduced\nour monthly electricity bills.\nThe service was professional and efficient.",
    rating: 5
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "School Principal",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "Our school's decision to install solar panels\nhas been both educational and economical.\nStudents now learn about renewable energy firsthand.",
    rating: 4
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Farm Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'My agricultural farm has benefited greatly\nfrom the solar installation. The energy costs\nhave reduced by 60% in the first year alone.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Meera Kapoor',
    role: 'School Principal',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Our school has transformed its energy usage\nwith the solar panel installation. We now save\non electricity and teach sustainability to our students.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    role: 'IT Professional',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'The smart home integration with the solar system\nis impressive. I can monitor energy production\nand consumption from my phone anytime.',
    rating: 5,
  },
  {
    id: 7,
    name: 'Neha Gupta',
    role: 'Environmental Consultant',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'As someone passionate about sustainability,\nI am impressed with the quality and efficiency\nof the solar installation provided.',
    rating: 5,
  },
  {
    id: 8,
    name: 'Sanjay Malhotra',
    role: 'Retired Government Officer',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'At my age, I was hesitant about investing in solar,\nbut the returns have been remarkable.\nThe system will pay for itself in just 4 years.',
    rating: 4,
  },
  {
    id: 9,
    name: 'Lakshmi Nair',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'Our restaurant\'s energy costs have decreased significantly\nsince installing solar panels. The investment\nhas been one of our best business decisions.',
    rating: 5,
  },
  {
    id: 10,
    name: 'Rahul Verma',
    role: 'Architect',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    quote: 'I appreciate the aesthetic integration of solar panels\ninto our building design. They complement\nthe architecture while providing clean energy.',
    rating: 5,
  },
];

const Testimonials = () => {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { testimonials, loading, fetchAboutPageData } = useAppContext();
  
  // Use context testimonials if available, otherwise fallback to static data
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;
  
  useEffect(() => {
    fetchAboutPageData();
  }, [fetchAboutPageData]);

  /* ---------------- RENDER STARS ---------------- */
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < rating ? 'text-[#a3c267]' : 'text-gray-300'} h-3 w-3`} 
      />
    ));
  };
  
  // Manual scrolling function removed as scroll buttons were removed

  return (
    <div className="mt-16 mb-10">
      {/* ---------- title block ---------- */}
      <div className="py-8 pb-0 px-4 text-center">
        <p className="text-gray-600 mb-2 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2 font-['Space_Grotesk'] font-[700]">
          Client Testimonials
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Space_Grotesk']">
          What Our <span className="text-[#a3c267]">Clients</span> Say
        </h2>
      </div>

      {/* Testimonials Slider */}
      <div className="mt-10 md:mt-16 px-4 md:px-8 lg:px-16">
        <style>
          {`
            .testimonials-slider-container {
              width: 100%;
              overflow: hidden;
              padding: 20px 0 40px;
              margin: 0 auto;
              position: relative;
              background-image: radial-gradient(rgba(202, 226, 142, 0.1) 1px, transparent 1px);
              background-size: 20px 20px;
              border-radius: 16px;
            }
            
            /* Add a stylish label to the left side */
            .testimonials-slider-container::before {
              content: 'REVIEWS';
              position: absolute;
              left: 5%;
              top: 50%;
              transform: translateY(-50%) rotate(180deg);
              writing-mode: vertical-lr;
              font-size: 2.5rem;
              font-weight: 800;
              color: rgba(202, 226, 142, 0.5);
              letter-spacing: 0.5rem;
              pointer-events: none;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
              z-index: 1;
            }
            
            .testimonials-slider {
               display: flex;
               gap: 24px;
               padding: 20px 10px;
               animation: testimonialSlideAnimation 60s linear infinite;
               will-change: transform;
               width: fit-content;
             }
             
             .testimonials-slider.paused {
               animation-play-state: paused;
             }
            
            @keyframes testimonialSlideAnimation {
               0% {
                transform: translateX(0);
               }
               100% {
                transform: translateX(calc(-344px * ${Math.floor(displayTestimonials.length / 2)}));
               }
             }
            
            .testimonial-card {
               width: 320px;
               min-width: 320px;
               max-width: 320px;
               flex: 0 0 320px;
               background: white;
               border-radius: 12px;
               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
               overflow: hidden;
               transition: all 0.3s ease;
               border: 1px solid rgba(202, 226, 142, 0.2);
               position: relative;
               margin: 10px 0;
               padding: 20px;
               display: flex;
               flex-direction: column;
               height: 280px;
               min-height: 280px;
               max-height: 280px;
             }
             
             .testimonial-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              border-color: rgba(163, 194, 103, 0.5);
            }
            
            .testimonial-card::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: linear-gradient(90deg, #cae28e, #a3c267);
              transform: scaleX(0);
              transform-origin: right;
              transition: transform 0.4s ease;
            }
            
            .testimonial-card:hover::after {
              transform: scaleX(1);
              transform-origin: left;
            }
          `}
        </style>
        
        <div 
          className="testimonials-slider-container" 
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Scroll buttons removed as requested */}
          
          <div className={`testimonials-slider ${isHovered ? 'paused' : ''}`}>
            {/* Original testimonials */}
            {displayTestimonials.map((testimonial) => (
              <div key={testimonial.id || testimonial._id} className="testimonial-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#a3c267] shadow-md mr-3 flex-shrink-0">
                    <img 
                      src={testimonial.image || '/logo.png'} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{testimonial.role || testimonial.position}</p>
                  </div>
                </div>
                
                <div className="flex-grow mb-4 overflow-hidden">
                  <div className="flex items-start">
                    <FaQuoteLeft className="text-[#a3c267] opacity-70 h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-xs leading-relaxed flex-grow overflow-hidden">
                      {(testimonial.quote || '').length > 120 ? `${(testimonial.quote || '').substring(0, 120)}...` : (testimonial.quote || '')}
                    </p>
                    <FaQuoteRight className="text-[#a3c267] opacity-70 h-3 w-3 ml-2 mt-1 flex-shrink-0" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <div className="flex">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  <span className="text-gray-600 text-xs font-medium">{testimonial.rating || 5}.0</span>
                </div>
              </div>
            ))}
            
            {/* Duplicate testimonials for infinite scroll effect */}
            {displayTestimonials.map((testimonial) => (
              <div key={`${testimonial.id || testimonial._id}-duplicate`} className="testimonial-card">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#a3c267] shadow-md">
                    <img 
                      src={testimonial.image || '/logo.png'} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="mb-3 text-[#a3c267] flex justify-center">
                  <FaQuoteLeft className="h-4 w-4 opacity-70" />
                </div>
                
                <div className="flex-grow mb-4 overflow-hidden">
                  <p className="text-gray-700 text-xs text-center leading-relaxed">
                    {(testimonial.quote || '').length > 120 ? `${(testimonial.quote || '').substring(0, 120)}...` : (testimonial.quote || '')}
                  </p>
                </div>
                
                <div className="flex flex-col items-center mt-auto pt-2 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm text-center truncate w-full">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 mb-2 truncate w-full text-center">{testimonial.role || testimonial.position}</p>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                    <span className="text-gray-600 text-xs font-medium">{testimonial.rating || 5}.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/testimonials" 
            className="inline-flex items-center px-5 py-2 bg-[#a3c267] text-black font-semibold rounded-full hover:bg-[#8db327] transition-colors shadow-md hover:shadow-lg group text-sm"
          >
            <span>View All Testimonials</span>
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
        </div>
      </div>
    </div>
  );
};

export default Testimonials;