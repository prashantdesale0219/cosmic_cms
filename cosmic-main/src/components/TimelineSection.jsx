import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Default fallback slides in case API fails
const defaultSlides = [
  {
    year: "2011",
    title: "Our nice super title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    backgroundImage: "https://unsplash.it/1920/500?image=11",
  },
  {
    year: "2012",
    title: "Solar Takes Off",
    description:
      "Enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    backgroundImage: "https://unsplash.it/1920/500?image=12",
  },
  {
    year: "2013",
    title: "Bright Future Begins",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    backgroundImage: "https://unsplash.it/1920/500?image=13",
  },
];

const TimelineSection = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [contentAnimClass, setContentAnimClass] = useState("");
  const [autoplay, setAutoplay] = useState(true);
  const intervalRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);

  // Fetch timeline data from API
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/frontend/timeline');
        
        if (response.data.status === 'success' && response.data.data.timeline.length > 0) {
          // Transform API data to match component structure
          const timelineData = response.data.data.timeline.map(item => ({
            year: item.year,
            title: item.title,
            description: item.description,
            backgroundImage: item.backgroundImage
          }));
          setSlides(timelineData);
        } else {
          // Use default slides if no data from API
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        // Use default slides on error
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  // Reset currentIndex if it's out of bounds when slides change
  useEffect(() => {
    if (slides.length > 0 && currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides, currentIndex]);

  const slideTo = (index) => {
    if (index === currentIndex || animating || !slides.length || index >= slides.length || index < 0) return;
    
    // Pause autoplay when manually changing slides
    setAutoplay(false);
    
    // Set slide
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
    setAnimating(true);
    setContentAnimClass("animate-slideContentLeft");
    
    // Resume autoplay after 5 seconds of inactivity (50% reduced from original 10 seconds)
    if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    autoplayTimeoutRef.current = setTimeout(() => {
      setAutoplay(true);
    }, 5000);
  };

  const nextSlide = () => {
    if (!slides.length) return;
    const nextIndex = (currentIndex + 1) % slides.length;
    slideTo(nextIndex);
  };

  const handleUp = () => {
    if (!slides.length || currentIndex <= 0) return;
    slideTo(currentIndex - 1);
  };

  const handleDown = () => {
    if (!slides.length || currentIndex >= slides.length - 1) return;
    slideTo(currentIndex + 1);
  };

  // Effect for autoplay
  useEffect(() => {
    // Only set interval if autoplay is enabled
    if (autoplay) {
      // Clear any existing interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      // Set a new interval for automatic sliding
      intervalRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        // Use direct state updates to avoid triggering the manual slide logic
        setPrevIndex(currentIndex);
        setCurrentIndex(nextIndex);
        setAnimating(true);
        setContentAnimClass("animate-slideContentLeft");
      }, 2500); // 2.5 seconds interval (50% reduced from original 5 seconds)
    } else {
      // Clear interval when autoplay is disabled
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    // Cleanup on component unmount or when dependencies change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    };
  }, [currentIndex, autoplay]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    };
  }, []);
  
  // Show loading state
  if (loading) {
    return (
      <div className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-black">Our Journey</h2>
          <p className="text-black-300 text-center max-w-2xl mx-auto text-base sm:text-lg">Discover the milestones that shaped our commitment to sustainable energy solutions.</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  // Don't render if no slides available
  if (!slides || slides.length === 0) {
    return (
      <div className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-black">Our Journey</h2>
          <p className="text-black-300 text-center max-w-2xl mx-auto text-base sm:text-lg">Discover the milestones that shaped our commitment to sustainable energy solutions.</p>
        </div>
        <div className="text-center text-gray-500 py-16">
          <p>No timeline data available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 ">
      {/* Section Title */}
      <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-black">Our Journey</h2>
        <p className="text-black-300 text-center max-w-2xl mx-auto text-base sm:text-lg">Discover the milestones that shaped our commitment to sustainable energy solutions.</p>
      </div>
      
      <div className="relative h-[90vh] sm:h-[80vh] w-full overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 z-0">
        {prevIndex !== null && (
          <div
            key={`prev-${prevIndex}`}
            className="absolute inset-0 bg-cover bg-center z-0 animate-fadeOutUp"
            style={{ 
              backgroundImage: `url('${slides[prevIndex].backgroundImage}')`,
              filter: 'grayscale(40%)' 
            }}
          />
        )}
        <div
          key={`current-${currentIndex}`}
          className="absolute inset-0 bg-cover bg-center z-10 animate-fadeInUp"
          style={{ 
            backgroundImage: slides[currentIndex] && slides[currentIndex].backgroundImage ? `url('${slides[currentIndex].backgroundImage}')` : 'none',
            filter: 'grayscale(40%)' 
          }}
          onAnimationEnd={() => setAnimating(false)}
        />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />

      {/* Slide Content with LEFT Animation */}
      <div
        className={`relative z-20 px-4 sm:px-0 sm:ml-20 max-w-xl text-white top-1/2 -translate-y-1/2 ${contentAnimClass}`}
        onAnimationEnd={() => setContentAnimClass("")}
      >
        <p className="italic text-lg sm:text-xl mb-1 sm:mb-2" style={{ color: "#cae28e" }}>
          {slides[currentIndex] ? slides[currentIndex].year : ''}
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight whitespace-pre-line">
          {slides[currentIndex] ? slides[currentIndex].title : ''}
        </h1>
        <p className="mt-3 sm:mt-6 text-sm leading-relaxed text-gray-300">
          {slides[currentIndex] ? slides[currentIndex].description : ''}
        </p>
      </div>

      {/* Timeline Controls - Desktop */}
      <div className="hidden sm:flex absolute top-0 right-12 h-full flex-col justify-center items-center z-20">
        <div
          onClick={handleUp}
          className="text-lg mb-6 cursor-pointer select-none"
          style={{ color: "#cae28e" }}
        >
          ▲
        </div>

        <div className="relative flex flex-col items-end gap-4 font-medium">
          <div className="absolute left-[-18px] top-0 bottom-0 w-[1.5px] bg-white opacity-50" />
          {slides.map((slide, index) => (
            <div
              key={`desktop-${index}`}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => slideTo(index)}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? "border border-white" : "bg-white/40"
                }`}
                style={{
                  backgroundColor: currentIndex === index ? "#cae28e" : undefined,
                }}
              ></div>
              <span
                className={`text-lg lg:text-xl transition duration-300 ${
                  currentIndex === index ? "text-white font-semibold" : ""
                }`}
                style={{
                  color: currentIndex === index ? "#ffffff" : "#cae28e",
                }}
              >
                {slide.year}
              </span>
            </div>
          ))}
        </div>

        <div
          onClick={handleDown}
          className="text-lg mt-6 cursor-pointer select-none"
          style={{ color: "#cae28e" }}
        >
          ▼
        </div>
      </div>
      
      {/* Timeline Controls - Mobile */}
      <div className="sm:hidden absolute bottom-4 left-0 right-0 flex justify-center items-center z-20">
        <div className="flex items-center gap-3">
          <div
            onClick={handleUp}
            className="text-lg cursor-pointer select-none p-2"
            style={{ color: "#cae28e" }}
          >
            ◀
          </div>
          
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <div
                key={`mobile-${index}`}
                onClick={() => slideTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "w-3 h-3" : ""}`}
                style={{
                  backgroundColor: currentIndex === index ? "#cae28e" : "rgba(255,255,255,0.4)",
                }}
              ></div>
            ))}
          </div>
          
          <div
            onClick={handleDown}
            className="text-lg cursor-pointer select-none p-2"
            style={{ color: "#cae28e" }}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeOutUp {
          0% {
            opacity: 1;
            transform: translateY(0%);
          }
          100% {
            opacity: 0;
            transform: translateY(-20%);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20%);
          }
          100% {
            opacity: 1;
            transform: translateY(0%);
          }
        }
        @keyframes slideContentLeft {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }

        @media (min-width: 640px) {
          @keyframes slideContentLeft {
            0% {
              opacity: 0;
              transform: translateX(-60px);
            }
            100% {
              opacity: 1;
              transform: translateX(0px);
            }
          }
        }

        .animate-fadeOutUp {
          animation: fadeOutUp 0.3s ease-in-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-in-out forwards;
        }
        .animate-slideContentLeft {
          animation: slideContentLeft 0.3s ease-out forwards;
        }
      `}</style>
      </div>
    </div>
  );
};

export default TimelineSection;
