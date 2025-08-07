import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, testimonialService } from '../services/api';
import {
  DocumentTextIcon,
  PhotoIcon,
  CubeIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  CloudIcon,
  LightBulbIcon,
  UsersIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  UserIcon,
  TagIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon, color, href, change, changeType }) => {
  const Icon = icon;
  
  return (
    <Link
      to={href}
      className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            changeType === 'positive' 
              ? 'text-green-400 bg-green-400/10' 
              : 'text-red-400 bg-red-400/10'
          }`}>
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-black mb-1">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
      
      <div className="mt-4 flex items-center text-gray-500 text-sm group-hover:text-black transition-colors duration-300">
        <EyeIcon className="w-4 h-4 mr-1" />
        View Details
      </div>
    </Link>
  );
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">Recent Activity</h2>
        <ClockIcon className="w-6 h-6 text-gray-600" />
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                {activity.type === 'user' && <UserIcon className="w-5 h-5 text-gray-600" />}
                {activity.type === 'content' && <DocumentTextIcon className="w-5 h-5 text-gray-600" />}
                {activity.type === 'media' && <PhotoIcon className="w-5 h-5 text-gray-600" />}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-black font-medium">{activity.message}</p>
                <div className="flex space-x-2 text-sm text-gray-600">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8">No recent activities</div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          to="/activity"
          className="text-gray-600 hover:text-black transition-colors duration-300 text-sm font-medium"
        >
          View all activity →
        </Link>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    products: 0,
    projects: 0,
    media: 0,
    testimonials: 0,
    team: 0,
    faqs: 0,
    categories: 0,
    tags: 0,
    contacts: 0
  });
  const [activities, setActivities] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and token exists
    const token = localStorage.getItem('token');
    if (!user || !token) {
      console.log('User not authenticated or token missing, redirecting to login');
      localStorage.removeItem('token'); // Clear any potentially invalid token
      window.location.href = '/login';
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching dashboard data...');
        const [statsResponse, testimonialsResponse] = await Promise.all([
          dashboardService.getStats(),
          testimonialService.getTestimonials(1, 6, '', 'createdAt', 'desc')
        ]);
        console.log('Dashboard data received:', statsResponse);
        console.log('Testimonials data received:', testimonialsResponse);
        
        if (statsResponse && statsResponse.success && statsResponse.data) {
          // Extract data from the response
          const data = statsResponse.data;
          
          setStats({
            users: data.totalUsers || data.users || 0,
            posts: data.totalPosts || data.posts || 0,
            products: data.totalProducts || data.products || 0,
            projects: data.totalProjects || data.projects || 0,
            media: data.totalMedia || data.media || 0,
            testimonials: data.totalTestimonials || data.testimonials || 0,
            team: data.totalTeamMembers || data.team || 0,
            faqs: data.totalFaqs || data.faqs || 0,
            categories: data.totalCategories || data.categories || 0,
            tags: data.totalTags || data.tags || 0,
            contacts: data.totalContacts || data.contacts || 0
          });
          
          // Set activities if available
          if (data.recentActivities && Array.isArray(data.recentActivities)) {
            setActivities(data.recentActivities);
          } else {
            setActivities([]);
          }
          
          // Set testimonials if available
          if (testimonialsResponse && testimonialsResponse.success && testimonialsResponse.data) {
            setTestimonials(testimonialsResponse.data.testimonials || testimonialsResponse.data || []);
          } else {
            setTestimonials([]);
          }
        } else {
          console.warn('Invalid response format or unsuccessful response:', statsResponse);
          // Set default values if response is not successful
          setStats({
            users: 0,
            posts: 0,
            products: 0,
            projects: 0,
            media: 0,
            testimonials: 0,
            team: 0,
            faqs: 0,
            categories: 0,
            tags: 0,
            contacts: 0
          });
          setActivities([]);
          
          // Set error message if available
          if (statsResponse && statsResponse.message) {
            setError(statsResponse.message);
          } else {
            setError('Failed to fetch dashboard data');
          }
          
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Dashboard data error:', err);
        
        // Check if error is due to authentication
        if (err.response && err.response.status === 401) {
          console.log('Authentication error, redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        
        setError('An error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Users',
      value: stats.users,
      icon: UserIcon,
      color: 'from-blue-500 to-purple-600',
      href: '/users',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Blog Posts',
      value: stats.posts,
      icon: DocumentTextIcon,
      color: 'from-green-500 to-emerald-600',
      href: '/blog-posts',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Products',
      value: stats.products,
      icon: CubeIcon,
      color: 'from-orange-500 to-red-600',
      href: '/products',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: BuildingOfficeIcon,
      color: 'from-indigo-500 to-blue-600',
      href: '/projects',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Media Files',
      value: stats.media,
      icon: PhotoIcon,
      color: 'from-teal-500 to-cyan-600',
      href: '/media',
      change: '+25%',
      changeType: 'positive'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-pink-600',
      href: '/about/testimonials',
      change: '+10%',
      changeType: 'positive'
    },
    {
      title: 'Team Members',
      value: stats.team,
      icon: UsersIcon,
      color: 'from-yellow-500 to-orange-600',
      href: '/team',
      change: '+7%',
      changeType: 'positive'
    },
    {
      title: 'FAQs',
      value: stats.faqs,
      icon: QuestionMarkCircleIcon,
      color: 'from-gray-500 to-slate-600',
      href: '/faqs',
      change: '+2%',
      changeType: 'positive'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: FolderIcon,
      color: 'from-amber-500 to-yellow-600',
      href: '/categories',
      change: '+4%',
      changeType: 'positive'
    },
    {
      title: 'Tags',
      value: stats.tags,
      icon: TagIcon,
      color: 'from-emerald-500 to-green-600',
      href: '/tags',
      change: '+6%',
      changeType: 'positive'
    },
    {
      title: 'Contact Messages',
      value: stats.contacts,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-rose-500 to-pink-600',
      href: '/contacts',
      change: '+18%',
      changeType: 'positive'
    },
  ];

  const quickActions = [
    { name: 'Create New Blog Post', href: '/posts/new', icon: DocumentTextIcon, color: 'from-green-500 to-emerald-600' },
    { name: 'Add New Product', href: '/products/new', icon: CubeIcon, color: 'from-orange-500 to-red-600' },
    { name: 'Upload Media', href: '/media/upload', icon: PhotoIcon, color: 'from-blue-500 to-cyan-600' },
    { name: 'Add Project', href: '/projects/new', icon: BuildingOfficeIcon, color: 'from-indigo-500 to-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">
              Welcome back, {user?.username || user?.email || 'Admin'}! 👋
            </h1>
            <p className="text-gray-700 text-lg">
              Here's what's happening with your Cosmic CMS today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Time</p>
                <p className="text-xl font-semibold text-black">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            href={card.href}
            change={card.change}
            changeType={card.changeType}
          />
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">Quick Actions</h2>
            <ChartBarIcon className="w-6 h-6 text-gray-600" />
          </div>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                to={action.href}
                className="group flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="ml-4 text-black font-medium group-hover:text-gray-700 transition-colors duration-300">
                  {action.name}
                </span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlusIcon className="w-5 h-5 text-gray-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Performance Overview</h2>
          <StarIcon className="w-6 h-6 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-black mb-2">98%</div>
            <div className="text-gray-600 text-sm">System Uptime</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-black mb-2">2.3s</div>
            <div className="text-gray-600 text-sm">Avg Response Time</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-black mb-2">1.2K</div>
            <div className="text-gray-600 text-sm">Total Visitors</div>
          </div>
        </div>
      </div>

      {/* Active Testimonials */}
      {testimonials.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">Recent Testimonials</h2>
            <Link 
              to="/about/testimonials" 
              className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-300"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial) => (
              <div key={testimonial._id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400 mr-4">
                    <img 
                      src={testimonial.image || '/logo.png'} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-black font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.position}</p>
                    {testimonial.company && (
                      <p className="text-gray-500 text-xs">{testimonial.company}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  {testimonial.featured && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;