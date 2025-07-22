import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaSolarPanel, FaHandshake, FaLightbulb } from 'react-icons/fa';

const CompanyCulture = () => {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Core values data
  const coreValues = [
    {
      icon: <FaLeaf className="h-10 w-10 text-[#9fc22f]" />,
      title: "Sustainability",
      description: "We are committed to environmental stewardship and promoting sustainable practices in everything we do."
    },
    {
      icon: <FaSolarPanel className="h-10 w-10 text-[#9fc22f]" />,
      title: "Innovation",
      description: "We continuously seek new technologies and approaches to improve our solar solutions and services."
    },
    {
      icon: <FaHandshake className="h-10 w-10 text-[#9fc22f]" />,
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical standards in all our business relationships."
    },
    {
      icon: <FaLightbulb className="h-10 w-10 text-[#9fc22f]" />,
      title: "Excellence",
      description: "We strive for the highest quality in our products, services, and customer interactions."
    },
  ];

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* Hero Section */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-[300px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/companyculture.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Company Culture</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-[#9fc22f] transition">
              Home
            </Link>
            <span>—</span>
            <Link to="/about" className="hover:text-[#9fc22f] transition">
              About
            </Link>
            <span>—</span>
            <span className="text-[#9fc22f]">Company Culture</span>
          </nav>
        </div>
      </motion.header>

      {/* Brand Vision & Strategy Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#003e63]">
                <span className="text-[#9fc22f]">Brand Vision & Stratergy</span>
              </h2>
              
              <p className="text-gray-700 mb-6">
                To make our future more vibrant and sustainable by using green energy to save the earth.
              </p>
              
              <p className="text-gray-700 mb-6">
                We are also committed to maintain our leadership position in the manufacture of solar products, delivering higher efficiency to the global photovoltaic industry.
              </p>
              
              <p className="text-gray-700 mb-6">
                To achieve 8 GW production capacity by 2025 to serve green energy demand internationally.
              </p>
              
              <Link 
                to="/contact" 
                className="group relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-[#9fc22f] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#9fc22f] transition-all duration-300 mt-4"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Join Our Mission</span>
                <span className="absolute inset-0 bg-[#003e63] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              </Link>
            </div>
            
            <div className="relative">
              <video 
                src="/company-culture.mp4" 
                alt="Company Culture Video" 
                className="rounded-lg shadow-lg w-full h-auto"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Values Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-3 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
              Our Core Values
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003e63]">
              The Principles That Guide Us
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003e63]">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Work Environment Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="Collaborative work environment" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-[#003e63]">
                Our Work <span className="text-[#9fc22f]">Environment</span>
              </h2>
              
              <p className="text-gray-700 mb-4">
                We foster a collaborative, inclusive, and innovative workplace where every team member can thrive. Our open office layout encourages communication and idea-sharing across departments.
              </p>
              
              <p className="text-gray-700 mb-4">
                We believe in work-life balance and offer flexible scheduling options to accommodate our employees' needs. Regular team-building activities and social events help strengthen relationships and boost morale.
              </p>
              
              <p className="text-gray-700 mb-4">
                Professional development is a priority, with ongoing training opportunities and clear career advancement paths for all employees.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Sustainability Management Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003e63]">
              <span className="text-[#9fc22f]">SUSTAINABILITY</span> <span className="text-[#003e63]">MANAGEMENT</span>
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Environmental Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-[#9fc22f] transition-transform duration-300 hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="/enviroment.jpeg" 
                  alt="Solar panels with city buildings" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-[#003e63]">Environmental</h3>
                <p className="text-gray-700 text-sm">
                  We prioritize environmental stewardship by utilizing renewable energy sources, implementing efficient manufacturing processes, and minimizing waste through comprehensive recycling programs.
                </p>
              </div>
            </motion.div>
            
            {/* Society Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-[#9fc22f] transition-transform duration-300 hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80" 
                  alt="Business handshake over solar panels" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-[#003e63]">Society</h3>
                <p className="text-gray-700 text-sm">
                  At Rayzon, we embody our core values of "Reliable, Value-added, Delighted," ensuring stakeholder satisfaction and community engagement through ethical business practices and social responsibility initiatives.
                </p>
              </div>
            </motion.div>
            
            {/* Governance Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-[#9fc22f] transition-transform duration-300 hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src="/governence.jpeg" 
                  alt="Solar panels with city buildings" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-[#003e63]">Governance</h3>
                <p className="text-gray-700 text-sm">
                  Rayzon is dedicated to upholding consistent operational excellence while collaborating closely with a diverse network of stakeholders to ensure transparent, ethical, and accountable business practices.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Sustainability Commitment Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#003e63] text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Our Commitment to <span className="text-[#9fc22f]">Sustainability</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Beyond our products, we're committed to sustainable operations in every aspect of our business.
          </p>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border-l-4 border-[#9fc22f]"
            >
              <h3 className="text-xl font-bold mb-4 text-[#9fc22f]">Carbon-Neutral Operations</h3>
              <p className="text-white">
                  Our facilities are powered by 100% renewable energy, and we offset any remaining carbon footprint through verified carbon credit programs.
                </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border-l-4 border-[#9fc22f]"
            >
              <h3 className="text-xl font-bold mb-4 text-[#9fc22f]">Waste Reduction</h3>
              <p className="text-white">
                  We've implemented comprehensive recycling programs and are working toward zero-waste manufacturing processes across all our facilities.
                </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border-l-4 border-[#9fc22f]"
            >
              <h3 className="text-xl font-bold mb-4 text-[#9fc22f]">Community Initiatives</h3>
              <p className="text-white">
                  We partner with local communities to promote environmental education and support renewable energy projects in underserved areas.
                </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Join Our Team CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#13181f]">
            Join Our <span className="text-[#9fc22f]">Team</span>
          </h2>
          
          <p className="text-gray-700 mb-8">
            We're always looking for talented individuals who share our passion for renewable energy and sustainability. Explore our current openings and become part of our mission to create a greener future.
          </p>
          
          <Link 
            to="/careers" 
            className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-[#9fc22f] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#9fc22f] transition-all duration-300"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">View Career Opportunities</span>
            <span className="absolute inset-0 bg-[#003e63] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default CompanyCulture;