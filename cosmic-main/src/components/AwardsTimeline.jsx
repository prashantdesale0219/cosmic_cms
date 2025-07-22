import React from "react";

// Simple slider without external dependencies

/* ------------------------------------------------------------------ */
/*  AWARDS DATA                                                       */
/* ------------------------------------------------------------------ */
const awards = [
  {
    year: "2021",
    label: "Best Quality\nAwards",
    tag: "Premium Materials",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    year: "2022",
    label: "Best Design\nAwards",
    tag: "Innovative Aesthetics",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    year: "2023",
    label: "Specific\nAwards",
    tag: "Technical Excellence",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    year: "2024",
    label: "Community\nAwards",
    tag: "Social Impact",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];



/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */
const AwardsTimeline = () => {

  /* ---------------- RENDER ---------------- */
  return (
    <div className="mb-10">
      {/* ---------- title block ---------- */}
      <div className="py-16 pb-0 px-4 text-center ">
        <p className="text-gray-600 mb-2 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2 font-['Space_Grotesk'] font-[700]">
          Recognition & Excellence
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Space_Grotesk']">
          Our <span className="text-[#a3c267]">Award-Winning</span> Solar<br />Solutions
        </h2>
      </div>

      {/* Custom CSS Slider */}


      {/* Awards Slider */}
      <div className="mt-10 md:mt-16 px-4 md:px-8 lg:px-16">
        <style>
          {`
            .awards-slider-container {
              width: 80%;
              overflow-x: auto;
              padding: 20px 0 40px;
              margin-left:20%;
              scrollbar-width: none; /* Firefox */
              padding-left: 20%; /* Adding 20% left padding as requested */
              position: relative;
              background-image: radial-gradient(rgba(202, 226, 142, 0.1) 1px, transparent 1px);
              background-size: 20px 20px;
              border-radius: 16px;
            }
            
            /* Add a stylish label to the left side */
            .awards-slider-container::before {
              content: 'AWARDS';
              position: absolute;
              left: 5%;
              top: 50%;
              transform: translateY(-50%);
              writing-mode: vertical-lr;
              transform: translateY(-50%) rotate(180deg);
              font-size: 2.5rem;
              font-weight: 800;
              color: rgba(202, 226, 142, 0.5);
              letter-spacing: 0.5rem;
              pointer-events: none;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .awards-slider-container::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Edge */
            }
            
            .awards-slider {
              display: flex;
              gap: 35px;
              padding: 20px 10px;
              animation: slideAnimation 45s linear infinite;
              will-change: transform;
            }
            
            .awards-slider:hover {
              animation-play-state: paused;
            }
            
            @keyframes slideAnimation {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-280px * 4 - 35px * 4)); /* Adjust based on card width + gap */
              }
            }
            
            .award-card {
              min-width: 280px;
              flex: 0 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
              overflow: hidden;
              transition: all 0.4s ease;
              border: 1px solid rgba(202, 226, 142, 0.2);
              position: relative;
              margin-top: 10px;
              margin-bottom: 10px;
            }
            
            .award-card:hover {
              transform: translateY(-8px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
              border-color: rgba(202, 226, 142, 0.6);
            }
            
            .award-card::after {
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
            
            .award-card:hover::after {
              transform: scaleX(1);
              transform-origin: left;
            }
            
            /* Badge animation */
            .award-card:hover .absolute.rounded-full {
              transform: scale(1.1) rotate(10deg);
              border-color: #a3c267;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            }
            
            .absolute.rounded-full {
              transition: all 0.4s ease;
              z-index: 10;
            }
            
            /* Improve image hover effect */
            .award-card .relative img {
              transition: transform 0.7s ease;
            }
            
            .award-card:hover .relative img {
              transform: scale(1.05);
            }
          `}
        </style>
        
        <div className="awards-slider-container">
          <div className="awards-slider">
            {/* Original awards */}
            {awards.map(({ year, label, tag, Icon }, index) => (
              <div key={year} className="award-card">
                <div className="relative">
                  <img 
                    src={index === 0 ? "/installation.jpg" : 
                         index === 1 ? "/solar-panels.jpg" : 
                         index === 2 ? "/quality-assurance.jpg" : 
                         "/site-assessment.jpg"} 
                    alt={`${year} milestone`}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 bg-[#cae28e] text-black px-3 py-1 font-medium rounded-br-md shadow-md">
                    {year}
                  </div>
                  
                  {/* Award badge image */}
                  <div className="absolute -bottom-8 right-4 w-16 h-16 rounded-full bg-white p-1 shadow-lg border-2 border-[#cae28e] overflow-hidden">
                    <img 
                      src={index === 0 ? "/solar1.png" : 
                           index === 1 ? "/solar_design.png" : 
                           index === 2 ? "/co2emission.png" : 
                           "/logo.png"} 
                      alt="Award badge"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="p-5 pt-10">
                  <div className="flex justify-center mb-4 text-[#a3c267]">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 font-['Space_Grotesk']">
                    {label.replace(/\n/g, " ")}
                  </h3>
                  <div className="flex justify-center">
                    <span className="inline-block bg-gray-50 rounded-full px-4 py-1 text-sm font-semibold text-gray-700 border border-gray-100">
                      {tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Duplicate awards for infinite scroll effect */}
            {awards.map(({ year, label, tag, Icon }, index) => (
              <div key={`${year}-duplicate`} className="award-card">
                <div className="relative">
                  <img 
                    src={index === 0 ? "/installation.jpg" : 
                         index === 1 ? "/solar-panels.jpg" : 
                         index === 2 ? "/quality-assurance.jpg" : 
                         "/site-assessment.jpg"} 
                    alt={`${year} milestone`}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 bg-[#cae28e] text-black px-3 py-1 font-medium rounded-br-md shadow-md">
                    {year}
                  </div>
                  
                  {/* Award badge image */}
                  <div className="absolute -bottom-8 right-4 w-16 h-16 rounded-full bg-white p-1 shadow-lg border-2 border-[#cae28e] overflow-hidden">
                    <img 
                      src={index === 0 ? "/solar1.png" : 
                           index === 1 ? "/solar_design.png" : 
                           index === 2 ? "/co2emission.png" : 
                           "/logo.png"} 
                      alt="Award badge"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="p-5 pt-10">
                  <div className="flex justify-center mb-4 text-[#a3c267]">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3 font-['Space_Grotesk']">
                    {label.replace(/\n/g, " ")}
                  </h3>
                  <div className="flex justify-center">
                    <span className="inline-block bg-gray-50 rounded-full px-4 py-1 text-sm font-semibold text-gray-700 border border-gray-100">
                      {tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsTimeline;
