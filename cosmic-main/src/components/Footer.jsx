import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import footerService from '../services/footerService'
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa'

const footerSections = [
  {
    title: 'Products',
    links: [
      { name: 'Solar Panels', path: '/products#panels' },
      { name: 'Inverters & Batteries', path: '/products#inverters' },
      { name: 'Accessories', path: '/products#accessories' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { name: 'Residential', path: '/solutions#residential' },
      { name: 'Commercial', path: '/solutions#commercial' },
      { name: 'Solar Calculator', path: '/calculator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Customer Stories', path: '/customer-stories' },
      { name: 'Partner With Us', path: '/partner' },
      { name: 'Contact Us', path: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Blog', path: '/resources#blog' },
      { name: 'Photo Gallery', path: '/resources#gallery' },
      { name: 'Newsletter', path: '/resources#newsletter' },
    ],
  },
]

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await footerService.getFooterData();
        if (data && data.success) {
          setFooterData(data.data);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Use API data if available, otherwise fallback to static data
  const sections = footerData?.sections?.filter(section => section.isActive) || footerSections;

  return (
    <footer
      className="bg-gradient-to-b from-primary-800 to-primary-900 text-white py-16 px-6 md:px-20 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: footerData?.design?.backgroundImage?.url 
          ? `url("${footerData.design.backgroundImage.url}")`
          : 'url("https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-footer-bg-layer-1.png")',
        backgroundColor: footerData?.design?.backgroundColor || undefined
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-accent-500/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Top Section with Logo and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 pb-16 border-b border-white/10">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 hover-pulse">
              <img 
                src={footerData?.companyInfo?.logo?.url || "logo.png"} 
                alt={footerData?.companyInfo?.logo?.altText || "Cosmic Solar"} 
                className="h-12" 
              />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              {footerData?.companyInfo?.description || "Empowering homes and businesses with sustainable solar solutions. Join us in creating a greener future with clean, renewable energy."}
            </p>
            <div className="space-y-3">
              {footerData?.companyInfo?.address && (
                <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                  <FaMapMarkerAlt className="mr-3 text-accent-500" />
                  <span>{footerData.companyInfo.address}</span>
                </div>
              )}
              {footerData?.companyInfo?.phone && (
                <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                  <FaPhoneAlt className="mr-3 text-accent-500" />
                  <span>{footerData.companyInfo.phone}</span>
                </div>
              )}
              {footerData?.companyInfo?.email && (
                <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                  <FaEnvelope className="mr-3 text-accent-500" />
                  <span>{footerData.companyInfo.email}</span>
                </div>
              )}
              {!footerData && (
                <>
                  <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                    <FaMapMarkerAlt className="mr-3 text-accent-500" />
                    <span>123 Solar Street, Green City, 12345</span>
                  </div>
                  <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                    <FaPhoneAlt className="mr-3 text-accent-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-300 hover:text-accent-500 transition-colors hover-pulse">
                    <FaEnvelope className="mr-3 text-accent-500" />
                    <span>info@cosmicsolar.com</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-8">
            {sections.slice(0, 2).map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-4 relative inline-block">
                  <span className="relative z-10">{section.title}</span>
                  <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-accent-500"></span>
                </h3>
                <ul className="space-y-3 text-gray-300">
                  {(section.links || []).map((link) => (
                    <li key={link.name || link.title}>
                      <Link
                        to={link.path || link.url}
                        className="hover:text-accent-500 transition-colors flex items-center group hover-pulse"
                      >
                        <span className="w-0 h-0.5 bg-accent-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                        {link.name || link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1 grid grid-cols-2 gap-8">
            {sections.slice(2, 4).map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-4 relative inline-block">
                  <span className="relative z-10">{section.title}</span>
                  <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-accent-500"></span>
                </h3>
                <ul className="space-y-3 text-gray-300">
                  {(section.links || []).map((link) => (
                    <li key={link.name || link.title}>
                      <Link
                        to={link.path || link.url}
                        className="hover:text-accent-500 transition-colors flex items-center group hover-pulse"
                      >
                        <span className="w-0 h-0.5 bg-accent-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                        {link.name || link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter Section */}
        {(footerData?.newsletter?.isEnabled !== false) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 pb-16 border-b border-white/10">
            <div>
              <h3 className="text-xl font-semibold mb-4 relative inline-block">
                <span className="relative z-10">{footerData?.newsletter?.title || "Subscribe to Our Newsletter"}</span>
                <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-accent-500"></span>
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                {footerData?.newsletter?.description || "Stay updated with the latest news, product launches, and exclusive offers from Cosmic Solar."}  
              </p>
            </div>
          <div>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder={footerData?.newsletter?.placeholder || "Enter your email"} 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                required
              />
              <button 
                type="submit" 
                className="group relative overflow-hidden bg-accent-500 text-black font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center border-2 border-transparent hover:border-accent-500 hover-glow"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{footerData?.newsletter?.buttonText || "Subscribe"}</span>
                <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform relative z-10 group-hover:text-white" />
              </button>
            </form>
          </div>
        </div>
        )}

        {/* Bottom Section with Copyright and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            {footerData?.copyright?.text || `© ${new Date().getFullYear()} Cosmic Powertech Solutions. All rights reserved.`}
          </p>

          <div className="flex gap-4">
            {footerData?.socialLinks?.length > 0 ? (
              footerData.socialLinks.map((social) => {
                const getSocialIcon = (platform) => {
                  switch (platform?.toLowerCase()) {
                    case 'facebook': return <FaFacebookF />;
                    case 'twitter': return <FaTwitter />;
                    case 'linkedin': return <FaLinkedinIn />;
                    case 'instagram': return <FaInstagram />;
                    default: return <FaFacebookF />;
                  }
                };
                
                return (
                  <a 
                    key={social.platform}
                    href={social.url} 
                    aria-label={social.platform} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-600 transition-colors duration-300 hover-pulse"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                );
              })
            ) : (
              // Fallback static social links
              <>
                <a 
                  href="#" 
                  aria-label="Facebook" 
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-600 transition-colors duration-300 hover-pulse"
                >
                  <FaFacebookF />
                </a>
                <a 
                  href="#" 
                  aria-label="Twitter" 
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-600 transition-colors duration-300 hover-pulse"
                >
                  <FaTwitter />
                </a>
                <a 
                  href="#" 
                  aria-label="LinkedIn" 
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-600 transition-colors duration-300 hover-pulse"
                >
                  <FaLinkedinIn />
                </a>
                <a 
                  href="#" 
                  aria-label="Instagram" 
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#cae28e] flex items-center justify-center text-white hover:text-black transition-colors duration-300 hover-pulse"
                >
                  <FaInstagram />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer