import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const DirectorDesk = () => {
  // Director information
  const director = {
    name: "Rajesh Kumar",
    position: "Managing Director & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    qualification: "M.Tech (Renewable Energy), MBA",
    experience: "20+ years in Solar Energy Sector",
    message: "As the Managing Director of Cosmic Solar Tech, I am proud to lead a team dedicated to revolutionizing the renewable energy landscape in India. Our journey began with a simple vision: to make clean, sustainable energy accessible to all. Today, we stand at the forefront of solar innovation, helping businesses and homeowners reduce their carbon footprint while achieving significant energy cost savings.\n\nThe global shift towards renewable energy is not just a trend but a necessity for our planet's future. At Cosmic Solar Tech, we are committed to accelerating this transition through cutting-edge technology, exceptional service, and unwavering integrity. Our team of experts works tirelessly to deliver customized solar solutions that meet the unique needs of each client.\n\nAs we look to the future, we remain focused on continuous innovation and expansion of our product offerings. We are investing in research and development to enhance solar efficiency, exploring energy storage solutions, and developing smart energy management systems that will define the next generation of renewable energy.\n\nI invite you to join us on this exciting journey towards a greener, more sustainable future. Together, we can harness the power of the sun to create a cleaner world for generations to come.",
    vision: "To be the leading provider of innovative solar solutions in India, driving the nation's transition to clean energy through excellence, integrity, and customer-centric approach.",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedin },
      { platform: "Twitter", url: "https://twitter.com", icon: FaTwitter },
      { platform: "Email", url: "mailto:director@cosmicsolar.com", icon: FaEnvelope },
    ],
  };

  // Key initiatives
  const initiatives = [
    {
      title: "Rural Electrification Project",
      description: "Leading a mission to bring solar power to 100 off-grid villages across India by 2026.",
    },
    {
      title: "Green Corporate Campus Initiative",
      description: "Partnering with major corporations to transform their facilities into solar-powered, carbon-neutral campuses.",
    },
    {
      title: "Solar Innovation Lab",
      description: "Established a research facility focused on developing next-generation solar technologies with improved efficiency and reduced costs.",
    },
    {
      title: "Skill Development Program",
      description: "Training the next generation of solar technicians and engineers through partnerships with technical institutions.",
    },
  ];

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* HERO SECTION */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-[300px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Director's Desk</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-green-400 transition">
              Home
            </Link>
            <span>—</span>
            <Link to="/about" className="hover:text-green-400 transition">
              About
            </Link>
            <span>—</span>
            <span className="text-green-400">Director's Desk</span>
          </nav>
        </div>
      </motion.header>

      {/* DIRECTOR PROFILE SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Director Image and Info */}
            <motion.div
              variants={fadeUpVariant}
              className="md:col-span-1"
            >
              <div className="relative">
                <img
                  src={director.image}
                  alt={director.name}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-[#cae28e] p-4 rounded-lg shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Company Logo"
                    className="h-12 w-auto"
                  />
                </div>
              </div>
              
              <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{director.name}</h3>
                <p className="text-[#cae28e] font-semibold mb-4">{director.position}</p>
                
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Qualification:</span> {director.qualification}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Experience:</span> {director.experience}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {director.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-[#cae28e] transition-colors duration-300"
                      aria-label={`Connect with director on ${link.platform}`}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Director's Message */}
            <motion.div
              variants={fadeUpVariant}
              className="md:col-span-2"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 relative">
                  <span className="relative z-10">Message from the Director</span>
                  <span className="absolute bottom-0 left-0 h-3 w-24 bg-[#cae28e]/40 -z-0"></span>
                </h2>
                
                <div className="relative text-gray-700 space-y-4">
                  <FaQuoteLeft className="absolute top-0 left-0 text-[#cae28e]/30 h-12 w-12 -translate-x-6 -translate-y-6" />
                  
                  {director.message.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">{paragraph}</p>
                  ))}
                  
                  <FaQuoteRight className="absolute bottom-0 right-0 text-[#cae28e]/30 h-12 w-12 translate-x-6 translate-y-6" />
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-[#13181f] text-white rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2 text-[#cae28e]">Our Vision</span>
                  <span className="h-px flex-grow bg-[#cae28e]/30"></span>
                </h3>
                <p className="italic">"{director.vision}"</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* KEY INITIATIVES SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Initiatives</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Under the leadership of our director, we are driving several strategic initiatives to expand our impact and advance solar technology.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-full bg-[#cae28e]/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-[#cae28e]">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{initiative.title}</h3>
                <p className="text-gray-700">{initiative.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#13181f] text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Our Solar Mission</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Whether you're looking to power your home, business, or join our team, we invite you to be part of our journey towards a sustainable future.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-[#cae28e] text-black font-semibold shadow-lg border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Contact Us</span>
              <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
            </Link>
            <Link
              to="/careers"
              className="group relative overflow-hidden inline-flex items-center px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:border-[#cae28e] transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300">Join Our Team</span>
              <span className="absolute inset-0 bg-[#cae28e] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default DirectorDesk;