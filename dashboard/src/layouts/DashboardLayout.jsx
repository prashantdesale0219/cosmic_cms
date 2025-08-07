import { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Bars3Icon,  
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  CubeIcon,
  BuildingOfficeIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  TagIcon,
  FolderIcon,
  Squares2X2Icon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars4Icon,
  LightBulbIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ClockIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [dropdownStates, setDropdownStates] = useState({});
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const toggleDropdown = (dropdownName) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'from-blue-500 to-purple-600' },
    { 
      name: 'Home', 
      icon: HomeIcon, 
      color: 'from-green-500 to-emerald-600',
      isDropdown: true,
      children: [
        { name: 'Hero Slides', href: '/hero-slides', icon: PhotoIcon, color: 'from-pink-500 to-rose-600' },
        { name: 'Happy Clients', href: '/happy-clients', icon: UserGroupIcon, color: 'from-cyan-500 to-blue-600' },
        { name: 'FAQs', href: '/faqs', icon: QuestionMarkCircleIcon, color: 'from-yellow-500 to-orange-600' },
        { name: 'Solar Solutions', href: '/solar-solutions', icon: LightBulbIcon, color: 'from-yellow-500 to-amber-600' },
        { name: 'Green Future', href: '/green-future', icon: LightBulbIcon, color: 'from-green-500 to-teal-600' },
        { name: 'Pan India Presence', href: '/pan-india-presence', icon: Squares2X2Icon, color: 'from-blue-500 to-cyan-600' },
        { name: 'Timeline', href: '/timeline', icon: ClockIcon, color: 'from-indigo-500 to-purple-600' },
        { name: 'Clients', href: '/clients', icon: UserGroupIcon, color: 'from-violet-500 to-purple-600' },
      ]
    },
    { 
      name: 'Services', 
      icon: LightBulbIcon, 
      color: 'from-amber-500 to-yellow-600',
      isDropdown: true,
      children: [
        { name: 'Hero Section', href: '/services/hero', icon: PhotoIcon, color: 'from-blue-500 to-cyan-600' },
        { name: 'Main Services', href: '/services/main-services', icon: LightBulbIcon, color: 'from-green-500 to-emerald-600' },
        { name: 'Additional Services', href: '/services/additional-services', icon: Squares2X2Icon, color: 'from-purple-500 to-pink-600' },
        // { name: 'Process Steps', href: '/services/process-steps', icon: ClockIcon, color: 'from-yellow-500 to-orange-600' },
        { name: 'CTA Section', href: '/services/cta', icon: ChatBubbleLeftRightIcon, color: 'from-indigo-500 to-blue-600' },
        { name: 'Savings Calculator', href: '/services/savings-calculator', icon: Cog6ToothIcon, color: 'from-teal-500 to-cyan-600' },
      ]
    },
    { 
      name: 'About', 
      icon: DocumentTextIcon, 
      color: 'from-purple-500 to-indigo-600',
      isDropdown: true,
      children: [
        { name: 'Hero Section', href: '/about/hero', icon: PhotoIcon, color: 'from-blue-500 to-cyan-600' },
        { name: 'About Us', href: '/about/about-us', icon: DocumentTextIcon, color: 'from-green-500 to-emerald-600' },
        { name: 'Who We Are', href: '/about/who-we-are', icon: UserGroupIcon, color: 'from-purple-500 to-pink-600' },
        { name: 'Our Expertise', href: '/about/our-expertise', icon: LightBulbIcon, color: 'from-yellow-500 to-orange-600' },
        { name: 'Why Choose Cosmic', href: '/about/why-choose-cosmic', icon: Squares2X2Icon, color: 'from-indigo-500 to-blue-600' },
        { name: 'Vision Mission Values', href: '/about/vision-mission-values', icon: ClockIcon, color: 'from-teal-500 to-cyan-600' },
        { name: 'Client Testimonials', href: '/about/testimonials', icon: ChatBubbleLeftRightIcon, color: 'from-rose-500 to-pink-600' },
      ]
    },
    { 
      name: 'Director Desk', 
      icon: UserCircleIcon, 
      color: 'from-amber-500 to-orange-600',
      isDropdown: true,
      children: [
        { name: 'Directors', href: '/directors', icon: UserGroupIcon, color: 'from-blue-500 to-cyan-600' },
        { name: 'Hero Section', href: '/directors/hero', icon: PhotoIcon, color: 'from-green-500 to-emerald-600' },
        { name: 'CTA Section', href: '/directors/cta', icon: LightBulbIcon, color: 'from-purple-500 to-pink-600' },
        { name: 'Team Section', href: '/team', icon: UserGroupIcon, color: 'from-green-500 to-teal-600' },
      ]
    },
    { 
      name: 'Company Culture', 
      icon: UserGroupIcon, 
      color: 'from-teal-500 to-cyan-600',
      isDropdown: true,
      children: [
        { name: 'Hero Section', href: '/company-culture/hero', icon: PhotoIcon, color: 'from-blue-500 to-cyan-600' },
        { name: 'Brand Vision', href: '/company-culture/brand-vision', icon: LightBulbIcon, color: 'from-green-500 to-emerald-600' },
        { name: 'Core Values', href: '/company-culture/core-values', icon: Squares2X2Icon, color: 'from-purple-500 to-pink-600' },
        { name: 'Work Environment', href: '/company-culture/work-environment', icon: BuildingOfficeIcon, color: 'from-yellow-500 to-orange-600' },
        { name: 'Sustainability Cards', href: '/company-culture/sustainability-cards', icon: CubeIcon, color: 'from-indigo-500 to-blue-600' },
        { name: 'Sustainability Commitment', href: '/company-culture/sustainability-commitment', icon: ClockIcon, color: 'from-teal-500 to-cyan-600' },
        { name: 'Join Team CTA', href: '/company-culture/join-team-cta', icon: ChatBubbleLeftRightIcon, color: 'from-rose-500 to-pink-600' },
      ]
    },
    { 
      name: 'Team Celebration', 
      icon: UserGroupIcon, 
      color: 'from-pink-500 to-rose-600',
      isDropdown: true,
      children: [
        { name: 'Hero Section', href: '/team-celebration/hero', icon: PhotoIcon, color: 'from-blue-500 to-cyan-600' },
        { name: 'Team Culture', href: '/team-celebration/culture', icon: UserGroupIcon, color: 'from-green-500 to-emerald-600' },
        { name: 'Celebration Events', href: '/team-celebration/events', icon: ClockIcon, color: 'from-purple-500 to-pink-600' },
        { name: 'Team Achievements', href: '/team-celebration/achievements', icon: Squares2X2Icon, color: 'from-yellow-500 to-orange-600' },
        { name: 'CTA Section', href: '/team-celebration/cta', icon: ChatBubbleLeftRightIcon, color: 'from-rose-500 to-pink-600' },
      ]
    },

    { name: 'Header', href: '/header', icon: ComputerDesktopIcon, color: 'from-blue-500 to-indigo-600' },
    { name: 'Footer', href: '/footer', icon: GlobeAltIcon, color: 'from-gray-500 to-slate-600' },
    { name: 'Blog Posts', href: '/posts', icon: DocumentTextIcon, color: 'from-green-500 to-emerald-600' },
    { name: 'Products', href: '/products', icon: CubeIcon, color: 'from-orange-500 to-red-600' },
    { name: 'Projects', href: '/projects', icon: BuildingOfficeIcon, color: 'from-indigo-500 to-blue-600' },
    { name: 'Media', href: '/media', icon: PhotoIcon, color: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-lg
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">
                Cosmic CMS
              </h1>
              <p className="text-xs text-gray-600">Admin Dashboard</p>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0 scrollbar-hide">
          {navigation.map((item) => {
            if (item.isDropdown) {
              const isAnyChildActive = item.children.some(child => location.pathname.startsWith(child.href));
              return (
                <div key={item.name} className="space-y-1">
                  {/* Dropdown Header */}
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    onMouseEnter={() => setIsHovered(item.name)}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`
                      group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                      ${isAnyChildActive 
                        ? 'bg-green-100 text-black shadow-lg' 
                        : 'text-gray-700 hover:text-black hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      {/* Animated background gradient */}
                      {isHovered === item.name && !isAnyChildActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 transition-opacity duration-300`} />
                      )}
                      
                      {/* Icon */}
                      <div className={`
                        relative z-10 mr-4 p-2 rounded-lg transition-all duration-300
                        ${isAnyChildActive 
                          ? 'bg-green-400 text-white' 
                          : 'bg-gray-200 text-gray-600 group-hover:bg-green-300 group-hover:text-white'
                        }
                      `}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      
                      {/* Text */}
                      <span className="relative z-10 font-medium">{item.name}</span>
                    </div>
                    
                    {/* Dropdown Arrow */}
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${
                      dropdownStates[item.name] ? 'rotate-180' : ''
                    }`} />
                    
                    {/* Active indicator */}
                    {isAnyChildActive && (
                      <div className="absolute right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  {/* Dropdown Items */}
                  {dropdownStates[item.name] && (
                    <div className="ml-4 space-y-1 border-l border-gray-300 pl-4">
                      {item.children.map((child) => {
                        const isActive = location.pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.name}
                            to={child.href}
                            onMouseEnter={() => setIsHovered(child.name)}
                            onMouseLeave={() => setIsHovered(null)}
                            className={`
                              group flex items-center px-3 py-2 rounded-lg transition-all duration-300 relative overflow-hidden
                              ${isActive 
                                ? 'bg-green-100 text-black shadow-lg' 
                                : 'text-gray-600 hover:text-black hover:bg-gray-100'
                              }
                            `}
                          >
                            {/* Animated background gradient */}
                            {isHovered === child.name && !isActive && (
                              <div className={`absolute inset-0 bg-gradient-to-r ${child.color} opacity-10 transition-opacity duration-300`} />
                            )}
                            
                            {/* Icon */}
                            <div className={`
                              relative z-10 mr-3 p-1.5 rounded-md transition-all duration-300
                              ${isActive 
                                ? 'bg-green-400 text-white' 
                                : 'bg-gray-200 text-gray-600 group-hover:bg-green-300 group-hover:text-white'
                              }
                            `}>
                              <child.icon className="w-4 h-4" />
                            </div>
                            
                            {/* Text */}
                            <span className="relative z-10 text-sm font-medium">{child.name}</span>
                            
                            {/* Active indicator */}
                            {isActive && (
                              <div className="absolute right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            } else {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onMouseEnter={() => setIsHovered(item.name)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`
                    group flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                    ${isActive 
                      ? 'bg-green-100 text-black shadow-lg' 
                      : 'text-gray-700 hover:text-black hover:bg-gray-100'
                    }
                  `}
                >
                  {/* Animated background gradient */}
                  {isHovered === item.name && !isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 transition-opacity duration-300`} />
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    relative z-10 mr-4 p-2 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-green-400 text-white' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-green-300 group-hover:text-white'
                    }
                  `}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Text */}
                  <span className="relative z-10 font-medium">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            }
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <Link 
            to="/profile" 
            className="flex items-center p-4 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-black">
                {user?.username || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-600">
                {user?.role || 'Admin'}
              </p>
            </div>
            <Cog6ToothIcon className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors duration-200" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-80">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Bars3Icon className="w-6 h-6 text-black" />
            </button>

            {/* Page title */}
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-black">
                {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'Dashboard'}
              </h2>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Admin Panel</span>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
                <BellIcon className="w-5 h-5 text-black" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200 group text-white"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;