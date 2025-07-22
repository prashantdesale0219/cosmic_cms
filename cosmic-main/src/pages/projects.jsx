import React, { useState, useEffect } from "react";
import { FiArrowRight, FiMapPin, FiMail, FiTruck, FiCheckCircle, FiChevronDown, FiPhone } from "react-icons/fi";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";

/* ------------------------- fallback data ------------------------- */
const fallbackProjectImages = [
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529861262172-f38517de9ec3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1566832512884-a1770ad0993b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
];

const processSteps = [
  {
    icon: <FiMapPin className="h-5 w-5" />,
    title: "Order Placement",
    desc: "Place an order by phone or online &amp; select the service you need."
  },
  {
    icon: <FiMail className="h-5 w-5" />,
    title: "Order Processing",
    desc: "We confirm your order &amp; assign a veteran technician to handle it."
  },
  {
    icon: <FiTruck className="h-5 w-5" />,
    title: "Last‑Mile Delivery",
    desc: "Panels arrive perfectly packed; our installers position everything."
  },
  {
    icon: <FiCheckCircle className="h-5 w-5" />,
    title: "Delivery Confirmation",
    desc: "Once commissioned, you’ll receive photos, videos &amp; a performance brief."
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1526481280690-9c06f8f9d5b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1609743521648-3c52bfeae409?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532394971762-3ec2f35b95fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
];

/* -------------------------------------------------------------- */
const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700">
      <button
        type="button"
        className="w-full flex justify-between items-center py-4 text-left text-gray-300 hover:text-white"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <FiChevronDown className={`transform transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && <div className="pb-6 text-sm text-gray-400">{children}</div>}
    </div>
  );
};

const ProjectsPage = () => {
  const { projects, fetchProjects } = useAppContext();
  // Removed loading state to prevent lazy loading
  const loading = false;
  const [projectData, setProjectData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);

  useEffect(() => {
    // Fetch projects from backend
    fetchProjects();
    
    // Set fallback data immediately to ensure projects are visible
    const fallbackData = fallbackProjectImages.map((src, idx) => ({
      _id: `fallback-${idx}`,
      title: `Solar Project ${idx + 1}`,
      description: `A ${idx % 2 === 0 ? 'residential' : 'commercial'} solar installation with ${(idx + 1) * 5} kW capacity.`,
      category: idx % 2 === 0 ? 'Residential' : 'Commercial',
      featuredImage: src,
      location: "Gujarat, India"
    }));
    
    setProjectData(fallbackData);
    
    // Set fallback gallery data
    const fallbackGallery = galleryImages.map((image, idx) => ({
      image: image,
      title: `Project ${idx + 1}`,
      category: idx % 2 === 0 ? 'Residential' : 'Commercial'
    }));
    
    setGalleryData(fallbackGallery);
  }, []);

  useEffect(() => {
    // If projects are loaded from context, use them
    // Otherwise, try to fetch directly from API
    const getProjects = async () => {
      // Make sure projects is an array before using it
      if (projects && Array.isArray(projects) && projects.length > 0) {
        console.log('Using projects from context:', projects.length);
        setProjectData(projects);
        
        // Extract gallery images from projects for the gallery section
        const extractedImages = [];
        projects.forEach(project => {
          if (project.images && Array.isArray(project.images) && project.images.length > 0) {
            // Add up to 2 images from each project to the gallery
            project.images.slice(0, 2).forEach(img => {
              extractedImages.push({
                image: img,
                title: project.title,
                category: project.category
              });
            });
          } else if (project.featuredImage) {
            extractedImages.push({
              image: project.featuredImage,
              title: project.title,
              category: project.category
            });
          }
        });
        
        // Limit to 6 images for gallery
        setGalleryData(extractedImages.slice(0, 6));
      } else {
        console.log('No projects from context, fetching from API');
        try {
          const response = await axios.get('/api/projects');
          console.log('API response:', response.data);
          
          // Handle different API response formats
          let projectsData = [];
          
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            projectsData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            projectsData = response.data;
          }
          
          if (projectsData.length > 0) {
            console.log('Setting project data from API:', projectsData.length);
            setProjectData(projectsData);
            
            // Extract gallery images from API response
            const extractedImages = [];
            projectsData.forEach(project => {
              if (project.images && Array.isArray(project.images) && project.images.length > 0) {
                project.images.slice(0, 2).forEach(img => {
                  extractedImages.push({
                    image: img,
                    title: project.title,
                    category: project.category
                  });
                });
              } else if (project.featuredImage) {
                extractedImages.push({
                  image: project.featuredImage,
                  title: project.title,
                  category: project.category
                });
              }
            });
            
            setGalleryData(extractedImages.slice(0, 6));
          } else {
            // If no valid data, use fallback data
            console.log('No valid project data from API, using fallback data');
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          // Use empty array, grid will use fallback images
        }
      }
    };

    getProjects();
  }, [projects]);

  return (
    <div className="font-sans text-gray-700 bg-gray-50">

      {/* ───────────── Hero ───────────── */}
      <section className="relative h-64 md:h-80 lg:h-96">
        <img
          src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80"
          alt="solar panels"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#13181f]/80 via-[#13181f]/70 to-[#13181f]/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4">Our Projects</h1>
          <p className="text-sm md:text-base max-w-xl mx-auto">Discover our innovative solar solutions transforming homes and businesses</p>
          <div className="mt-6 md:mt-8">
            <button className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">Explore Now</button>
          </div>
        </div>
      </section>

      {/* ───────────── Projects Grid ───────────── */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Our Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our portfolio of completed solar installations showcases our commitment to quality and innovation</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : projectData && projectData.length > 0 ? (
            // Actual project data
            projectData.map((project, idx) => (
              <div key={project._id || idx} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-accent-400 text-accent-950 text-xs font-medium px-2.5 py-1 rounded-full">
                    {project.category || (idx % 2 === 0 ? 'Residential' : 'Commercial')}
                  </div>
                  <img
                    src={project.featuredImage || project.image}
                    alt={project.title || `Project ${idx + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{project.title || `Solar Project ${idx + 1}`}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description || "A state-of-the-art solar installation providing clean, renewable energy."}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.location || "Gujarat, India"}</span>
                    <Link to={`/projects/${project._id || idx}`} className="text-accent-600 hover:text-accent-800 font-medium flex items-center gap-1 text-sm">
                      View Details <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to sample images
            fallbackProjectImages.map((src, idx) => (
              <div key={idx} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-accent-400 text-accent-950 text-xs font-medium px-2.5 py-1 rounded-full">
                    {idx % 2 === 0 ? 'Residential' : 'Commercial'}
                  </div>
                  <img
                  src={src}
                  alt={`project-${idx}`}
                  className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13181f]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Link to={`/projects/${idx}`} className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300">View Details</Link>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Solar Project {idx + 1}</h3>
                <p className="text-gray-600 text-sm mb-3">A {idx % 2 === 0 ? 'residential' : 'commercial'} solar installation with {(idx + 1) * 5} kW capacity.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">{2020 + idx} • </span>
                    <span>{idx % 2 === 0 ? 'Residential' : 'Commercial'}</span>
                  </div>
                  <Link to={`/projects/${idx}`} className="text-accent-600 hover:text-accent-700 cursor-pointer text-sm font-medium flex items-center">
                    View Details <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/projects" className="border-2 border-accent-400 text-accent-600 hover:bg-accent-400 hover:text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md inline-block">View All Projects</Link>
        </div>
      </section>

      {/* ───────────── Delivery Process ───────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Delivery Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We follow a streamlined process to ensure your solar installation is completed efficiently and to the highest standards</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-accent-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-accent-600 text-xl">
                  {step.icon}
                </div>
                <div className="flex items-center mb-3">
                  <span className="bg-accent-400 text-accent-950 text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">{idx + 1}</span>
                  <h3 className="font-bold text-xl">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/services" className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md inline-block">Learn More About Our Process</Link>
          </div>
        </div>
      </section>

      {/* ───────────── Banner Section ───────────── */}
      <section className="py-16 bg-[#13181f] text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#13181f] to-[#1c280b] rounded-2xl overflow-hidden shadow-xl">
            <div className="md:flex items-center">
              <div className="md:w-1/2 p-8 md:p-12">
                <span className="bg-accent-800/50 text-accent-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Get Started</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Solar Journey?</h2>
                <p className="text-accent-100 mb-8">Contact us today for a free consultation and quote. Our team of experts is ready to help you transition to clean, renewable energy.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center shadow-lg">
                    <FiPhone className="mr-2" /> Call Us
                  </button>
                  <button className="bg-white text-[#13181f] hover:bg-accent-50 px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center shadow-lg">
                    <FiMail className="mr-2" /> Email Us
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                  alt="Solar panels on a sunny day" 
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#13181f]/90 md:bg-gradient-to-r"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Quote Form ───────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Free Estimate</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get a Free Quote</h2>
                <p className="text-gray-600 mb-8">Fill out the form and one of our solar experts will contact you to discuss your needs and provide a customized quote.</p>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input type="text" id="first-name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input type="text" id="last-name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-colors duration-300" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-colors duration-300" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                    <input type="text" id="address" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-colors duration-300" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                    <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-colors duration-300"></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input id="terms" type="checkbox" className="h-4 w-4 text-accent-600 focus:ring-accent-400 border-gray-300 rounded" />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">I agree to the terms and privacy policy</label>
                  </div>
                  
                  <button type="submit" className="w-full bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md">Submit Request</button>
                </form>
              </div>
              
              <div className="md:w-1/2 bg-[#13181f] p-8 md:p-12 text-white">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Why Choose Our Solar Solutions?</h3>
                    
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-accent-300">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-accent-100">High-quality solar panels with 25+ years warranty</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-accent-300">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-accent-100">Professional installation by certified technicians</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-accent-300">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-accent-100">Customized solutions for residential and commercial properties</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-accent-300">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-accent-100">Financing options and assistance with incentives</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-accent-300">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-accent-100">Ongoing maintenance and support services</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-[#1c280b]">
                    <h4 className="font-medium text-xl mb-4">Have Questions?</h4>
                    <div className="space-y-3">
                      <a href="tel:+11234567890" className="flex items-center text-accent-300 hover:text-accent-100 transition-colors duration-300">
                        <FiPhone className="mr-3" /> (123) 456-7890
                      </a>
                      <a href="mailto:info@example.com" className="flex items-center text-accent-300 hover:text-accent-100 transition-colors duration-300">
                        <FiMail className="mr-3" /> info@example.com
                      </a>
                      <div className="flex items-center text-accent-300">
                        <FiMapPin className="mr-3" /> 123 Solar Street, Sunshine City, SC 12345
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Gallery Section ───────────── */}
      <section className="py-16 bg-accent-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-accent-100 text-accent-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4 inline-block">Gallery</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Project Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse through our collection of completed solar installations across various residential and commercial properties</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              // Loading skeleton for gallery
              [...Array(6)].map((_, idx) => (
                <div key={idx} className="rounded-lg h-48 md:h-64 bg-gray-200 animate-pulse"></div>
              ))
            ) : galleryData && galleryData.length > 0 ? (
              // Dynamic gallery from backend data
              galleryData.map((item, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg h-48 md:h-64 shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.title || `Gallery image ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = galleryImages[idx % galleryImages.length]; // Fallback to static image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13181f]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium text-lg">{item.title || `Project ${idx + 1}`}</h3>
                    <p className="text-gray-200 text-sm">{item.category || (idx % 2 === 0 ? 'Residential' : 'Commercial')} Installation</p>
                    <Link to={`/projects/${item._id || idx}`} className="mt-2 bg-accent-400 hover:bg-accent-500 text-accent-950 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all duration-300 w-max">View Details</Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to static gallery images
              galleryImages.map((image, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg h-48 md:h-64 shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={image} 
                    alt={`Gallery image ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13181f]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium text-lg">Project {idx + 1}</h3>
                    <p className="text-gray-200 text-sm">{idx % 2 === 0 ? 'Residential' : 'Commercial'} Installation</p>
                    <Link to={`/projects/${idx}`} className="mt-2 bg-accent-400 hover:bg-accent-500 text-accent-950 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all duration-300 w-max">View Details</Link>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="mb-8">
              <span className="text-accent-600 font-medium mb-2 block">Explore More</span>
              <h3 className="text-2xl font-bold mb-2">Want to See More?</h3>
              <p className="text-gray-600">Schedule a tour or view our complete portfolio</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-accent-400 hover:bg-accent-500 text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md">Schedule a Tour</button>
              <button className="border-2 border-accent-400 text-accent-600 hover:bg-accent-400 hover:text-accent-950 px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-md">View Portfolio</button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default ProjectsPage;
