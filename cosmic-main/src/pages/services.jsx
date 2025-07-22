import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun,FiCheck, FiZap, FiSettings, FiTool, FiCheckCircle, FiHome, FiTruck, FiCpu, FiBarChart, FiArrowRight } from 'react-icons/fi';

const Services = () => {
  const mainServices = [
    {
      title: 'Installation Services',
      description: 'Professional solar system installation with expert team',
      features: [
        'Site assessment and planning',
        'Custom system design',
        'Professional installation',
        'Quality testing and commissioning',
        'Grid connection assistance',
        'Documentation and warranties'
      ],
      icon: <FiSun className="w-10 h-10" />,
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-50',
      hoverColor: 'group-hover:text-accent-500'
    },
    {
      title: 'Maintenance Services',
      description: 'Regular maintenance and monitoring for optimal performance',
      features: [
        'Scheduled inspections',
        'Performance monitoring',
        'Cleaning services',
        'Repair and replacement',
        'Emergency support',
        '24/7 customer service'
      ],
      icon: <FiSettings className="w-10 h-10" />,
      color: 'from-accent-300 to-accent-500',
      bgColor: 'bg-accent-50',
      hoverColor: 'group-hover:text-accent-500'
    },
    {
      title: 'Consulting Services',
      description: 'Expert advice for your solar energy needs',
      features: [
        'Energy audit',
        'ROI analysis',
        'Technical feasibility study',
        'Financial planning',
        'Regulatory compliance',
        'Project management'
      ],
      icon: <FiBarChart className="w-10 h-10" />,
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-50',
      hoverColor: 'group-hover:text-accent-500'
    }
  ];

  const additionalServices = [
    {
      title: 'Energy Storage Solutions',
      description: 'Battery systems for energy independence',
      longDesc: 'Store excess solar energy for use during nighttime or power outages with our advanced battery storage solutions.',
      icon: <FiZap />,
      image: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-accent-400 to-accent-600'
    },
    {
      title: 'Smart Home Integration',
      description: 'Connect your solar system with home automation',
      longDesc: 'Integrate your solar system with smart home technology to optimize energy usage and enhance convenience.',
      icon: <FiHome />,
      image: 'https://images.unsplash.com/photo-1558002038-876f1d0aa8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-accent-300 to-accent-500'
    },
    {
      title: 'Commercial Solutions',
      description: 'Specialized services for businesses',
      longDesc: 'Custom solar solutions designed specifically for commercial properties to reduce operational costs and carbon footprint.',
      icon: <FiTruck />,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-accent-400 to-accent-600'
    },
    {
      title: 'EV Charging Integration',
      description: 'Solar powered charging solutions',
      longDesc: 'Power your electric vehicle with clean solar energy using our integrated EV charging stations.',
      icon: <FiCpu />,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      color: 'from-accent-300 to-accent-500'
    }
  ];
  
  // Service process steps with more details
  const processSteps = [
    {
      number: 1,
      title: 'Consultation',
      description: 'Initial meeting and site assessment',
      longDesc: 'We begin with a thorough consultation to understand your energy needs and goals.',
      icon: <FiTool />
    },
    {
      number: 2,
      title: 'Design',
      description: 'Custom solution design and planning',
      longDesc: 'Our engineers create a custom solar system design optimized for your property.',
      icon: <FiSettings />
    },
    {
      number: 3,
      title: 'Installation',
      description: 'Professional system installation',
      longDesc: 'Our certified technicians install your solar system with minimal disruption.',
      icon: <FiSun />
    },
    {
      number: 4,
      title: 'Support',
      description: 'Ongoing maintenance and support',
      longDesc: 'We provide continuous monitoring and support to ensure optimal performance.',
      icon: <FiCheckCircle />
    }
  ];

  // State for service hover effect
  const [activeService, setActiveService] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-[300px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Service</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition">
              Home
            </Link>
            <span>—</span>
            <span className="text-accent-500">Service</span>
          </nav>
        </div>
      </header>

      {/* Main Services Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Core Services
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We provide comprehensive solar solutions to meet your energy needs
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {mainServices.map((service, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative bg-white rounded-xl p-8 shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 ${service.bgColor}`}
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-6 text-gray-800 transition-all duration-300 ${service.hoverColor}">
                    {service.icon}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-gray-800">
                    {service.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 transition-all duration-300">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <FiCheckCircle className={`mt-1 mr-2 transition-all duration-300 ${service.hoverColor}`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <Link to="/contact" className="inline-flex items-center text-sm font-medium transition-all duration-300 ${service.hoverColor}">
                      Learn more <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Specialized Solutions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Enhance your solar experience with our additional specialized services
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-10"></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <span className="text-white text-4xl">{service.icon}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-green-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-500">
                    <p className="text-gray-700 text-sm">
                      {service.longDesc}
                    </p>
                    <Link 
                      to="/contact" 
                      className="mt-4 inline-flex items-center text-sm font-medium text-yellow-green-600 hover:text-yellow-green-700 transition-colors duration-300"
                    >
                      Learn more <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Our Streamlined Process
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We've perfected our approach to deliver exceptional solar solutions with efficiency and precision
            </motion.p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-green-200 via-yellow-green-400 to-yellow-green-200 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4 relative z-10">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="text-center group cursor-pointer">
                    <div className="relative">
                      <div className="bg-white rounded-full h-28 w-28 flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-yellow-green-100 group-hover:border-yellow-green-400 transition-all duration-300 z-20">
                        <div className="absolute inset-0 bg-yellow-green-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <span className="text-4xl text-yellow-green-600 relative z-10 group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-xl border-2 border-white shadow-lg z-30">
                        {step.number}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-yellow-green-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 px-4">
                      {step.description}
                    </p>
                    
                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 px-4">
                      <p className="text-gray-700 text-sm">
                        {step.longDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-green-600 hover:bg-yellow-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-green-500"
            >
              Start Your Solar Journey <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/solar-panels-sunset.jpg" 
            alt="Solar panels at sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#13181f]/90 to-[#13181f]/70"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform <br />
                <span className="text-yellow-green-400">Your Energy Future?</span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-xl">
                Join thousands of satisfied customers who have reduced their carbon footprint and energy costs with our premium solar solutions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-green-400/20 flex items-center justify-center">
                    <FiCheck className="h-6 w-6 text-yellow-green-400" />
                  </div>
                  <p className="ml-4 text-white">Save up to 70% on your monthly energy bills</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-green-400/20 flex items-center justify-center">
                    <FiCheck className="h-6 w-6 text-yellow-green-400" />
                  </div>
                  <p className="ml-4 text-white">Increase your property value significantly</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-green-400/20 flex items-center justify-center">
                    <FiCheck className="h-6 w-6 text-yellow-green-400" />
                  </div>
                  <p className="ml-4 text-white">Qualify for tax incentives and rebates</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-[#13181f] bg-yellow-green-400 hover:bg-yellow-green-500 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Started Today <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/quote"
                  className="inline-flex items-center justify-center px-6 py-4 border border-yellow-green-400 text-base font-medium rounded-md text-yellow-green-400 hover:bg-yellow-green-400/10 transition-all duration-300 focus:outline-none"
                >
                  Request Free Quote
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Calculate Your Savings</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="monthly-bill" className="block text-sm font-medium text-gray-200 mb-2">Your Monthly Electric Bill ($)</label>
                  <input 
                    type="number" 
                    id="monthly-bill" 
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-green-400 focus:border-transparent"
                    placeholder="e.g. 150"
                  />
                </div>
                
                <div>
                  <label htmlFor="sunlight" className="block text-sm font-medium text-gray-200 mb-2">Daily Sunlight Hours</label>
                  <select 
                    id="sunlight" 
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-green-400 focus:border-transparent"
                  >
                    <option value="4">Less than 4 hours</option>
                    <option value="5">4-5 hours</option>
                    <option value="6">5-6 hours</option>
                    <option value="7">More than 6 hours</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="roof-size" className="block text-sm font-medium text-gray-200 mb-2">Roof Size (sq ft)</label>
                  <input 
                    type="number" 
                    id="roof-size" 
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-green-400 focus:border-transparent"
                    placeholder="e.g. 1500"
                  />
                </div>
                
                <button 
                  className="w-full py-4 px-6 bg-yellow-green-400 hover:bg-yellow-green-500 text-[#13181f] font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Calculate My Savings
                </button>
                
                <p className="text-sm text-gray-300 text-center mt-4">
                  Get your personalized savings estimate instantly. No commitment required.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;