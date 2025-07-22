import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  CloudIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Hero Slides', href: '/hero-slides', icon: PhotoIcon },
    { name: 'Blog Posts', href: '/posts', icon: DocumentTextIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Projects', href: '/projects', icon: BuildingOfficeIcon },
    { name: 'Testimonials', href: '/testimonials', icon: ChatBubbleLeftRightIcon },
    // { name: 'Team Members', href: '/team', icon: UserGroupIcon },
    { name: 'FAQs', href: '/faqs', icon: QuestionMarkCircleIcon },
    // { name: 'Categories', href: '/categories', icon: FolderIcon },
    // { name: 'Tags', href: '/tags', icon: TagIcon },
    // { name: 'Contacts', href: '/contacts', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Media', href: '/media', icon: PhotoIcon },
    // { name: 'Menus', href: '/menus', icon: Bars4Icon },
    { name: 'CO2 Emissions', href: '/co2-emissions', icon: CloudIcon },
    { name: 'Energy Solutions', href: '/energy-solutions', icon: LightBulbIcon },
  ];

  // Admin-only navigation items
  const adminNavigation = [
    // { name: 'Users', href: '/users', icon: UsersIcon },
    // { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  // User navigation dropdown items
  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Sign out', href: '#', onClick: logout },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 ${sidebarOpen ? 'opacity-75' : 'opacity-0 pointer-events-none'} transition-opacity ease-linear duration-300`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition ease-in-out duration-300`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
                Cosmic CMS
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname.startsWith(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      location.pathname.startsWith(item.href)
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && adminNavigation.length > 0 && (
                <div className="mt-8">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                  <div className="mt-1 space-y-1">
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          location.pathname.startsWith(item.href)
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-4 h-6 w-6 ${
                            location.pathname.startsWith(item.href)
                              ? 'text-primary-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link to="/profile" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="inline-block h-10 w-10 rounded-full text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
                Cosmic CMS
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname.startsWith(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      location.pathname.startsWith(item.href)
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && adminNavigation.length > 0 && (
                <div className="mt-8">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                  <div className="mt-1 space-y-1">
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          location.pathname.startsWith(item.href)
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 ${
                            location.pathname.startsWith(item.href)
                              ? 'text-primary-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link to="/profile" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="inline-block h-9 w-9 rounded-full text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;