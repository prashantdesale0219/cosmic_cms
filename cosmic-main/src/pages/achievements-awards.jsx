import React from 'react';
import { Link } from 'react-router-dom';
import AwardsTimeline from '../components/AwardsTimeline';

// Sample achievements data
const achievements = [
  {
    id: 1,
    title: "Excellence in Solar Innovation",
    year: "2024",
    organization: "Renewable Energy Association",
    description: "Recognized for pioneering advancements in solar panel efficiency and design.",
    image: "/quality-assurance.jpg"
  },
  {
    id: 2,
    title: "Green Business of the Year",
    year: "2023",
    organization: "Chamber of Commerce",
    description: "Awarded for outstanding commitment to sustainable business practices and environmental stewardship.",
    image: "/installation.jpg"
  },
  {
    id: 3,
    title: "Best Customer Service",
    year: "2023",
    organization: "Consumer Choice Awards",
    description: "Recognized for exceptional customer service and satisfaction in the renewable energy sector.",
    image: "/site-assessment.jpg"
  },
  {
    id: 4,
    title: "Top Solar Installer",
    year: "2022",
    organization: "Solar Energy Industries Association",
    description: "Ranked among the top solar installation companies nationwide for quality and volume of installations.",
    image: "/solar-panels.jpg"
  },
  {
    id: 5,
    title: "Innovation in Renewable Energy",
    year: "2021",
    organization: "Tech & Energy Summit",
    description: "Honored for innovative approaches to integrating solar technology with smart home systems.",
    image: "/quality.jpg"
  },
];

// Achievement Card Component
function AchievementCard({ achievement }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-accent-200">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={achievement.image} 
          alt={achievement.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-accent-500 text-white px-4 py-2 rounded-bl-lg font-medium">
          {achievement.year}
        </div>
      </div>
      <div className="p-6">
        <div className="text-sm text-gray-500 mb-2">{achievement.organization}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
        <p className="text-gray-600">{achievement.description}</p>
      </div>
    </div>
  );
}

// Certificate Section Component
function CertificateSection() {
  const certificates = [
    { id: 1, name: "ISO 9001:2015", description: "Quality Management System" },
    { id: 2, name: "ISO 14001:2015", description: "Environmental Management System" },
    { id: 3, name: "OHSAS 18001", description: "Occupational Health and Safety" },
    { id: 4, name: "Solar Energy Certification", description: "Industry Standard Compliance" },
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">Our Certifications</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We maintain the highest standards of quality and safety through these industry-recognized certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent-500 hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-accent-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
              <p className="text-gray-600">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Recognition Section Component
function RecognitionSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">Industry Recognition</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our commitment to excellence has been recognized by leading organizations in the renewable energy sector.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {["/bharatpetrlium1.jpg", "/kia.png", "/logo.png", "/mahavir.webp", "/logo.png"].map((logo, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
              <img src={logo} alt={`Partner logo ${index + 1}`} className="h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Achievements & Awards Page Component
export default function AchievementsAwardsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url('/quality1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Achievements & Awards</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-300 transition-colors">Home</Link>
            <span>—</span>
            <Link to="/blog" className="hover:text-accent-300 transition-colors">Media</Link>
            <span>—</span>
            <span className="text-accent-300">Achievements & Awards</span>
          </div>
        </div>
      </div>

      {/* Awards Timeline Section */}
      <section className="py-16 bg-white">
        <AwardsTimeline />
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We take pride in our accomplishments and the recognition we've received for our dedication to excellence in the solar energy industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <CertificateSection />

      {/* Industry Recognition Section */}
      <RecognitionSection />

      {/* Call to Action Section */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Award-Winning Team</h2>
          <p className="text-lg mb-8 text-gray-200">
            Experience the difference of working with an industry leader in solar energy solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="group relative overflow-hidden inline-flex items-center justify-center rounded-full bg-accent-500 px-8 py-3 text-base font-semibold text-black shadow-lg border-2 border-transparent hover:border-accent-500 transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Contact Us Today</span>
              <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
            </Link>
            <Link 
              to="/services" 
              className="inline-flex items-center justify-center rounded-full bg-transparent px-8 py-3 text-base font-semibold text-white border-2 border-white hover:bg-white hover:text-primary-800 transition-all duration-300"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}