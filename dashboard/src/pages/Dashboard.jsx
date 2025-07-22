import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';

// Import icons
import { 
  UserIcon, 
  DocumentTextIcon, 
  CubeIcon, 
  PhotoIcon, 
  ChatBubbleLeftRightIcon,
  TagIcon,
  FolderIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon, bgColor, linkTo }) => {
  const Icon = icon;
  
  return (
    <Link 
      to={linkTo} 
      className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {activity.type === 'user' && <UserIcon className="h-5 w-5 text-gray-400" />}
                      {activity.type === 'content' && <DocumentTextIcon className="h-5 w-5 text-gray-400" />}
                      {activity.type === 'media' && <PhotoIcon className="h-5 w-5 text-gray-400" />}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <div className="flex space-x-2">
                        <p className="text-sm text-gray-500">{activity.user}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">No recent activities</li>
          )}
        </ul>
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
        const response = await dashboardService.getStats();
        console.log('Dashboard data received:', response);
        
        if (response && response.success && response.data) {
          // Extract data from the response
          const data = response.data;
          
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
        } else {
          console.warn('Invalid response format or unsuccessful response:', response);
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
          if (response && response.message) {
            setError(response.message);
          } else {
            setError('Failed to fetch dashboard data');
          }
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}! Here's what's happening with your website.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {user?.role === 'admin' && (
              <StatCard 
                title="Users" 
                value={stats.users} 
                icon={UserIcon} 
                bgColor="bg-blue-500" 
                linkTo="/users" 
              />
            )}
            
            <StatCard 
              title="Blog Posts" 
              value={stats.posts} 
              icon={DocumentTextIcon} 
              bgColor="bg-indigo-500" 
              linkTo="/blog-posts" 
            />
            
            <StatCard 
              title="Products" 
              value={stats.products} 
              icon={CubeIcon} 
              bgColor="bg-yellow-500" 
              linkTo="/products" 
            />
            
            <StatCard 
              title="Projects" 
              value={stats.projects} 
              icon={Squares2X2Icon} 
              bgColor="bg-green-500" 
              linkTo="/projects" 
            />
            
            <StatCard 
              title="Media Files" 
              value={stats.media} 
              icon={PhotoIcon} 
              bgColor="bg-purple-500" 
              linkTo="/media" 
            />
            
            <StatCard 
              title="Testimonials" 
              value={stats.testimonials} 
              icon={ChatBubbleLeftRightIcon} 
              bgColor="bg-pink-500" 
              linkTo="/testimonials" 
            />
            
            <StatCard 
              title="Team Members" 
              value={stats.team} 
              icon={UserIcon} 
              bgColor="bg-red-500" 
              linkTo="/team" 
            />
            
            <StatCard 
              title="FAQs" 
              value={stats.faqs} 
              icon={DocumentTextIcon} 
              bgColor="bg-cyan-500" 
              linkTo="/faqs" 
            />
            
            <StatCard 
              title="Categories" 
              value={stats.categories} 
              icon={FolderIcon} 
              bgColor="bg-orange-500" 
              linkTo="/categories" 
            />
            
            <StatCard 
              title="Tags" 
              value={stats.tags} 
              icon={TagIcon} 
              bgColor="bg-teal-500" 
              linkTo="/tags" 
            />
            
            <StatCard 
              title="Contact Messages" 
              value={stats.contacts} 
              icon={ChatBubbleLeftRightIcon} 
              bgColor="bg-gray-500" 
              linkTo="/contacts" 
            />
          </div>
          
          <div className="mt-8">
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;