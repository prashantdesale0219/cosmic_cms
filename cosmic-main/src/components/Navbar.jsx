/*  src/components/Navbar.jsx  */
import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const { pathname } = useLocation();
  
  // Handle scroll event to make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      // Get the top info bar height (if visible)
      const topBarHeight = document.querySelector('.top-info-bar')?.offsetHeight || 0;
      
      // Set sticky when scroll position is greater than top bar height
      setIsSticky(window.scrollY > topBarHeight);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Static navigation data instead of fetching from API
  const navigation = [
    { label: "Home", href: "/" },
    { 
      label: "About", 
      href: "/about",
      submenu: [
        { label: "Director's Desk", href: "/director-desk" },
        { label: "Company Culture", href: "/company-culture" },
        { label: "Team Celebration", href: "/team-celebration" }
        
        
      ]
    },
    { 
      label: "Products", 
      href: "/products",
      submenu: [
        { label: "Solar Panels", href: "/products/solar-panels" },
        { label: "Inverters & Batteries", href: "/products/inverters-batteries" },
        { label: "Accessories", href: "/products/accessories" }
      ]
    },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { 
      label: "Calculator", 
      href: "/calculator",
      
    },
    { 
      label: "Media", 
      href: "/blog",
      submenu: [
        { label: "Blog", href: "/blog" },
        { label: "All Posts", href: "/blog" },
        { label: "News", href: "/blog?category=news" },
        { label: "Press Releases", href: "/pr" },
        { label: "Awards and Achievements", href: "/achievements-awards" }
      ]
    },
    { label: "Contact", href: "/contact" },
  ];
  
  const toggleSubmenu = useCallback((label) => {
    setOpenSubmenu(prev => prev === label ? null : label);
  }, []);

  /* ——————————— top info bar (updated) ——————————— */
  const TopBar = () => (
    <div className="hidden lg:block bg-accent-500 text-black py-2 top-info-bar">
      <div className="w-4/5 mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <i className="las la-map-marker mr-2 text-base"></i>
            <span className="text-sm font-medium">No. 56 A, Baltimore 4508</span>
          </div>
          <div className="flex items-center ml-6">
            <i className="las la-envelope mr-2 text-base"></i>
            <span className="text-sm font-medium">info@example.com</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium">We are Social :</span>
          <div className="flex space-x-3">
            <a href="https://facebook.com" className="hover:text-gray-700" aria-label="Facebook">
              <i className="lab la-facebook-f text-base"></i>
            </a>
            <a href="https://twitter.com" className="hover:text-gray-700" aria-label="Twitter">
              <i className="lab la-twitter text-base"></i>
            </a>
            <a href="https://instagram.com" className="hover:text-gray-700" aria-label="Instagram">
              <i className="lab la-instagram text-base"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  /* ——————————— main bar (logo left) ——————————— */
  const MainBar = () => (
    <div className={`bg-primary-800 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 w-full shadow-md z-50 animate-slideDown' : ''}`}>
      <div className="w-4/5 mx-auto flex h-16 sm:h-20 items-center justify-between">
        <Link to="/" className="flex-shrink-0 select-none hover-pulse">
          <img src="/logo.png" alt="Zolar" className="h-8 sm:h-10 w-auto" />
        </Link>

        {/* desktop nav */}
        <ul className="hidden flex-1 justify-center space-x-8 text-base font-medium lg:flex">
          {navigation.map((item) => {
            const { label, href, target, submenu } = item;
            const isActive = pathname === href || (submenu && submenu.some(sub => pathname === sub.href));
            
            return (
              <li key={label} className="group relative flex items-center">
                {submenu ? (
                  <>
                    <Link 
                      to={href}
                      target={target || "_self"}
                      className={`relative transition-colors ${isActive ? "text-accent-500" : "text-white"} group-hover:text-accent-500 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent-500 after:transition-all after:duration-300 group-hover:after:w-full hover-pulse`}
                    >
                      {label}
                    </Link>
                    <span className="ml-1 transform text-accent-500 opacity-70 transition-transform duration-300 group-hover:rotate-45">+</span>
                    
                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible transform scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-200 ease-in-out">
                      <div className="py-1">
                        {submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            target={subItem.target || "_self"}
                            className={`block px-4 py-2 text-sm ${pathname === subItem.href ? "bg-accent-500/10 text-accent-500" : "text-gray-700"} hover:bg-accent-500/10 hover:text-accent-500 hover-pulse`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                    to={href}
                    target={target || "_self"}
                    className={`relative transition-colors ${pathname === href ? "text-accent-500" : "text-white"} group-hover:text-accent-500 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent-500 after:transition-all after:duration-300 group-hover:after:w-full hover-pulse`}
                  >
                    {label}
                  </Link>
                    <span className="ml-1 transform text-accent-500 opacity-70 transition-transform group-hover:rotate-45">+</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        {/* right cluster */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="group hidden md:inline-flex lg:hidden relative overflow-hidden items-center rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold shadow-md border-2 border-transparent hover:border-accent-500 transition-all duration-300"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Enquire Now</span>
            <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          </Link>

          <button onClick={() => setOpen((p) => !p)} className="text-gray-300 hover:text-accent-500 transition-colors duration-300 lg:hidden hover-pulse">
            {open ? 
              <XMarkIcon className="h-7 w-7" /> : 
              <div className="flex flex-col space-y-1.5">
                <span className="h-0.5 w-6 bg-gray-300 rounded-full"></span>
                <span className="h-0.5 w-5 bg-gray-300 rounded-full ml-1"></span>
                <span className="h-0.5 w-4 bg-gray-300 rounded-full ml-2"></span>
              </div>
            }             
          </button>

          <Link
            to="/contact"
            className="group hidden lg:inline-flex relative overflow-hidden items-center rounded-full bg-accent-500 px-7 py-2.5 text-base font-semibold shadow-lg border-2 border-transparent hover:border-accent-500 transition-all duration-300"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Enquire Now</span>
            <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          </Link>
        </div>
      </div>
    </div>
  );

  /* ——————————— mobile drawer with stagger ——————————— */
  const MobileDrawer = () => (
    <>
      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-60 transition-all duration-300 ease-in-out ${open ? "backdrop-blur-sm bg-accent-500/60 opacity-100" : "pointer-events-none backdrop-blur-0 bg-transparent opacity-0"}`}
      />

      {/* panel */}
      <nav
        className={`fixed right-0 top-0 z-70 h-full w-72 bg-white shadow-xl transition-all duration-400 ease-in-out ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-95"}`}
      >
        {/* close */}
        <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-accent-500 hover:text-primary-600 transition-all duration-300 hover:rotate-90 transform hover-pulse">
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Logo in mobile menu */}
        <div className="pt-6 px-6 flex justify-start bg-primary-800">
          <Link to="/" onClick={() => setOpen(false)} className="flex-shrink-0 select-none hover-pulse">
            <img src="/logo.png" alt="Zolar" className="h-10 w-auto" />
          </Link>
        </div>

        <div className="pt-2">
          {navigation.map((item, idx) => {
            const { label, href, target, submenu } = item;
            const isSubmenuOpen = openSubmenu === label;
            const active = pathname === href || (submenu && submenu.some(sub => pathname === sub.href));
            
            if (submenu && submenu.length > 0) {
              return (
                <div key={label}>
                  <div className="flex w-full">
                    <Link
                      to={href}
                      onClick={() => setOpen(false)}
                      target={target || "_self"}
                      style={{ transitionDelay: `${idx * 75}ms` }}
                      className={`flex-grow flex items-center px-6 py-4 text-lg font-medium transform-gpu transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"} ${active ? "bg-accent-500 text-white" : "text-gray-900"} hover:bg-[#f2f2f2] hover-pulse`}
                    >
                      {label}
                    </Link>
                    <button
                      onClick={() => toggleSubmenu(label)}
                      style={{ transitionDelay: `${idx * 75}ms` }}
                      className={`px-4 py-4 text-lg font-medium transform-gpu transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"} ${active ? "bg-accent-500 text-white" : "text-gray-900"} hover:bg-[#f2f2f2] hover-pulse`}
                    >
                      <ChevronRightIcon className={`h-5 w-5 ${active ? "text-white" : "text-gray-900"} transition-transform duration-300 ease-in-out ${isSubmenuOpen ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Submenu items */}
                  <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isSubmenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {submenu.map((subItem) => {
                      const subActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          onClick={() => setOpen(false)}
                          target={subItem.target || "_self"}
                          className={`flex items-center pl-10 pr-6 py-3 text-base font-medium transition-all duration-300 ease-out ${subActive ? "bg-accent-500/10 text-accent-500" : "text-gray-700"} hover:bg-accent-500/10 hover:text-accent-500 hover:pl-12 hover-pulse`}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                target={target || "_self"}
                style={{ transitionDelay: `${idx * 60}ms` }}
                className={`flex items-center justify-between px-6 py-4 text-lg font-medium transform-gpu transition-all duration-400 ease-out ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"} ${active ? "bg-accent-500 text-white" : "text-gray-900"} hover:bg-[#f2f2f2] hover-pulse`}
              >
                {label}
                <ChevronRightIcon className={`h-5 w-5 ${active ? "text-white" : "text-gray-900"}`} />
              </Link>
            );
          })}

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: `${navigation.length * 60}ms` }}
            className={`group relative overflow-hidden mt-6 mx-6 block px-7 py-3 text-base font-semibold bg-accent-500 rounded-full text-center transform-gpu transition-all duration-400 ease-out border-2 border-transparent hover:border-accent-500 ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Get Quotes</span>
            <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          </Link>

          {/* Social icons in mobile menu */}
          <div className={`mt-8 px-6 flex items-center justify-center gap-4 transform-gpu transition-all duration-400 ease-out ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${(navigation.length + 1) * 60}ms` }}>
            {[
              { id: "facebook", url: "https://facebook.com" },
              { id: "twitter", url: "https://twitter.com" },
              { id: "linkedin", url: "https://linkedin.com" },
              { id: "instagram", url: "https://instagram.com" }
            ].map((social) => (
              <a 
                key={social.id} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-accent-500 transition-colors duration-300 group hover-pulse"
                aria-label={`Visit our ${social.id} page`}
              >
                <i className={`lab la-${social.id} text-2xl transition-transform duration-300 group-hover:scale-125`} />
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );

  /* ——————————— render ——————————— */
  return (
    <header className="relative z-50">
      <div className="hidden md:block">
        <TopBar />
      </div>
      <MainBar />
      {/* Spacer div to prevent content jump when navbar becomes fixed */}
      {isSticky && <div className="h-16 sm:h-20"></div>}
      <MobileDrawer />
    </header>
  );
}