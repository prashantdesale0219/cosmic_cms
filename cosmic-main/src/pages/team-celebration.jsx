import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {FaCalendarAlt, FaTrophy, FaUsers, FaGlassCheers } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Event card component
function EventCard({ event }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 bg-[#cae28e] text-black px-4 py-2 font-medium">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0L6.343 16.657A8 8 0 1 1 17.657 16.657Z" strokeWidth={1.5} />
            <circle cx="12" cy="11" r="3" strokeWidth={1.5} />
          </svg>
          {event.location}
        </p>
        <p className="text-gray-700 flex-grow">{event.description}</p>
        <Link 
          to="#" 
          className="group relative overflow-hidden inline-flex items-center px-3 py-1 rounded-full bg-transparent text-[#13181f] font-medium border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Learn more</span>
          <span className="absolute inset-0 bg-[#13181f] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          <svg 
            className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1 relative z-10 stroke-current group-hover:stroke-white transition-all duration-300" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

// Achievement item component
function AchievementItem({ achievement, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-shrink-0 bg-[#cae28e] text-[#13181f] p-3 rounded-full">
        <FaTrophy className="h-6 w-6" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded">{achievement.year}</span>
          <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">Awarded by: {achievement.organization}</p>
        <p className="text-gray-700">{achievement.description}</p>
      </div>
    </motion.div>
  );
}

const TeamCelebration = () => {
  const [teamData, setTeamData] = useState({
    hero: null,
    culture: null,
    events: [],
    achievements: [],
    cta: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamCelebrationData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/team-celebration`);
        if (!response.ok) {
          throw new Error('Failed to fetch team celebration data');
        }
        const result = await response.json();
        if (result.success) {
          setTeamData(result.data);
        }
      } catch (err) {
        console.error('Error fetching team celebration data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamCelebrationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#cae28e]"></div>
      </div>
    );
  }

  const { hero, culture, events, achievements, cta } = teamData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-24 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${hero?.backgroundImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80'}')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">{hero?.title || 'Team Celebrations & Achievements'}</h1>
            <p className="text-xl text-gray-200 mb-8">
              {hero?.subtitle || 'At SS Tech, we believe in celebrating our successes, recognizing excellence, and building a strong team culture.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#events" 
                className="group relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-[#cae28e] text-black font-semibold hover:bg-white transition-colors duration-300 border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white"><FaGlassCheers className="mr-2 inline" /> Upcoming Events</span>
                <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              </a>
              <a 
                href="#achievements" 
                className="group relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-colors duration-300 hover:border-[#cae28e] transition-all duration-300"
              >
                <span className="relative z-10 transition-colors duration-300"><FaTrophy className="mr-2 inline" /> Our Achievements</span>
                <span className="absolute inset-0 bg-[#cae28e] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Culture Section */}
      {culture && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">{culture.title || 'Our Team Culture'}</h2>
                <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: culture.description || 'At SS Tech, we foster a culture of innovation, collaboration, and celebration.' }} />
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#cae28e]">15+</div>
                    <div className="text-sm text-gray-600">Annual Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#cae28e]">90%</div>
                    <div className="text-sm text-gray-600">Employee Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#cae28e]">12+</div>
                    <div className="text-sm text-gray-600">Industry Awards</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src={culture.image || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"} 
                  alt="Team culture" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-[#cae28e] p-4 rounded-lg shadow-lg">
                  <FaUsers className="h-12 w-12 text-[#13181f]" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section id="events" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Team Events</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Join us for these exciting team events and celebrations. These gatherings are designed to recognize achievements, foster team bonding, and create memorable experiences.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {events.map((event) => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We take pride in the recognition our team has received for excellence in innovation, sustainability, and workplace culture.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <AchievementItem key={achievement._id || achievement.id || achievement.title} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      {cta && (
        <section className="py-16 bg-[#13181f] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6">{cta.title || 'Join Our Award-Winning Team'}</h2>
              <div className="text-xl text-gray-300 mb-8" dangerouslySetInnerHTML={{ __html: cta.description || 'Be part of a culture that celebrates success, fosters innovation, and values every team member\'s contribution.' }} />
              <Link 
                to={cta.buttonLink || "/careers"} 
                className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-[#cae28e] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{cta.buttonText || 'View Open Positions'}</span>
                <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                <span className="ml-3 flex items-center justify-center h-7 w-7 rounded-full bg-black group-hover:bg-[#cae28e] transition-all duration-300 relative z-10">
                  <svg 
                    className="h-4 w-4 stroke-white group-hover:stroke-black transition-all duration-300" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    strokeWidth={2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default TeamCelebration;