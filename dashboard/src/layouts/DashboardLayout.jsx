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
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'from-blue-500 to-purple-600' },
    { name: 'Hero Slides', href: '/hero-slides', icon: PhotoIcon, color: 'from-pink-500 to-rose-600' },
    { name: 'Blog Posts', href: '/posts', icon: DocumentTextIcon, color: 'from-green-500 to-emerald-600' },
    { name: 'Products', href: '/products', icon: CubeIcon, color: 'from-orange-500 to-red-600' },
    { name: 'Projects', href: '/projects', icon: BuildingOfficeIcon, color: 'from-indigo-500 to-blue-600' },
    { name: 'Testimonials', href: '/testimonials', icon: ChatBubbleLeftRightIcon, color: 'from-purple-500 to-pink-600' },
    { name: 'FAQs', href: '/faqs', icon: QuestionMarkCircleIcon, color: 'from-yellow-500 to-orange-600' },
    { name: 'Media', href: '/media', icon: PhotoIcon, color: 'from-teal-500 to-cyan-600' },
    { name: 'Energy Solutions', href: '/energy-solutions', icon: LightBulbIcon, color: 'from-amber-500 to-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-300 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cosmic CMS
              </h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
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
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
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
                    ? 'bg-black text-white' 
                    : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'
                  }
                `}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                {/* Text */}
                <span className="relative z-10 font-medium">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <Link 
            to="/profile" 
            className="flex items-center p-4 rounded-xl hover:bg-gray-900 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                {user?.username || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-400">
                {user?.role || 'Admin'}
              </p>
            </div>
            <Cog6ToothIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-80">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-lg border-b border-gray-800">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Page title */}
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">
                {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'Dashboard'}
              </h2>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Admin Panel</span>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 group"
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