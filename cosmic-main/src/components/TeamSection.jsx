import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaChevronDown, FaChevronUp } from "react-icons/fa6";

/* ------------ data ------------ */
const members = [
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
    name: "Alex Morgan",
    role: "Director",
    title: "Head - Operations",
    bio: "Alex is responsible for consistency and excellent product and service quality. Strengthening the quality of the processes and product through implementing best practices, and working with various suppliers at Cosmic.",
    linkedin: "#"
  },
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
    name: "Henry Wilson",
    role: "Director",
    title: "Head - Quality",
    bio: "Henry is responsible for consistency and excellent product and service quality. Strengthening the quality of the processes and product through implementing best practices, and working with various suppliers at Cosmic.",
    linkedin: "#"
  },
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
    name: "James Peterson",
    role: "Director",
    title: "Head - Production",
    bio: "James is responsible for consistency and excellent product and service quality. Strengthening the quality of the processes and product through implementing best practices, and working with various suppliers at Cosmic.",
    linkedin: "#"
  },
  
];



const TeamSection = () => {
  const [expandedMember, setExpandedMember] = useState(null);
  
  const toggleBio = (name) => {
    if (expandedMember === name) {
      setExpandedMember(null);
    } else {
      setExpandedMember(name);
    }
  };
  
  return (
    <>
  <section className="relative bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* heading */}
      <header className="mb-12">
        <div className="border-l-4 border-primary-600 pl-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Team Cosmic</h2>
        </div>
        <p className="text-gray-600 max-w-3xl mt-6">
          The management team of Cosmic incorporates innovators and problem-solvers with a passion for making the world a better place. They bring out the best in our employees and believe in 'growing together'.
        </p>
      </header>

      <div className="mt-10">
        <p className="text-sm font-medium text-primary-600 uppercase mb-6 flex items-center">
          <span className="inline-block w-6 h-0.5 bg-primary-600 mr-2"></span>
          OUR PEOPLE
        </p>
        
        {/* cards */}
        <div className="grid gap-12 sm:gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mx-auto">
          {members.map((member) => {
            const isExpanded = expandedMember === member.name;
            return (
              <div key={member.name} className="flex flex-col group border border-gray-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100 transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto">
                <div className="relative overflow-hidden">
                  {/* Expandable Bio Section - Positioned over image */}
                  {isExpanded && (
                    <div className="absolute inset-0 bg-primary-900 bg-opacity-90 z-10 p-4 flex flex-col transition-all duration-300 ease-in-out">
                      <div className="flex items-start mb-3">
                        <h4 className="text-md font-bold text-white">{member.title}</h4>
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                        >
                          <FaLinkedinIn size={14} />
                        </a>
                      </div>
                      <p className="text-white text-sm leading-relaxed flex-grow overflow-y-auto">{member.bio}</p>
                      <div className="h-1 w-12 bg-accent-500 mt-3"></div>
                    </div>
                  )}
                  <div className="w-full h-80 relative">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-accent-600 text-sm font-medium mb-3">{member.role}</p>
                  <button 
                    onClick={() => toggleBio(member.name)}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 font-medium bg-transparent border-none cursor-pointer p-0"
                  >
                    {isExpanded ? (
                      <>
                        HIDE BIO <FaChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        SHOW BIO <FaChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
  

  </>
  );
};

export default TeamSection;
