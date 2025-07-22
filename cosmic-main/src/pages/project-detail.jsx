import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Heart, Share2, Facebook, Twitter, Linkedin, Star, Info, Check, Shield, Truck, RefreshCw, Calendar, MapPin, User, Clock, Zap } from 'lucide-react';
import { projectService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiBaseUrl } = useAppContext();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [galleryView, setGalleryView] = useState(false);

  // Sample fallback project data in case API fails
  const fallbackProject = {
    _id: 'fallback-project',
    title: 'Solar Installation Project',
    slug: 'solar-installation-project',
    description: 'This state-of-the-art solar installation provides clean, renewable energy for residential use. The system includes high-efficiency solar panels, inverters, and a monitoring system that allows the homeowner to track energy production in real-time.',
    category: 'Residential',
    location: 'Gujarat, India',
    completionDate: new Date().toISOString(),
    client: 'Residential Customer',
    coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80',
      'https://images.unsplash.com/photo-1611365892117-00d23f8302c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
    ],
    specifications: [
      '5kW system capacity',
      '15 high-efficiency solar panels',
      'Grid-tied inverter system',
      'Monitoring system with mobile app',
      '25-year warranty on panels',
    ],
    challenge: 'The client needed a renewable energy solution that would significantly reduce their electricity bills while being aesthetically pleasing and not taking up valuable yard space.',
    solution: 'We designed a custom rooftop solar system that maximizes energy production while maintaining the homes aesthetic appeal. The system was installed with minimal disruption to the clients daily life.',
    results: 'The system produces approximately 7,500 kWh annually, covering about 80% of the households electricity needs. The client is expected to save ₹75,000 per year on electricity bills, with a payback period of approximately 5 years.',
    testimonial: {
      content: 'The team was professional from start to finish. They explained everything clearly, installed the system quickly, and the results have exceeded our expectations. Our electricity bills have dropped dramatically!',
      name: 'Rajesh Patel',
      position: 'Homeowner',
      company: '',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    systemSize: '5 kW',
    annualProduction: '7,500 kWh',
    co2Reduction: '5.3 tons annually',
    installationTime: '3 days',
    projectManager: 'Amit Sharma',
  };

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        
        // Check if id is a MongoDB ObjectId or a slug
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          response = await projectService.getProjectById(id);
        } else {
          response = await projectService.getProjectBySlug(id);
        }
        
        // Handle different API response formats
        let projectData;
        
        if (response.data && response.data.data) {
          // Standard API response format with data property
          projectData = response.data.data;
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          // Direct object response format
          projectData = response.data;
        } else {
          console.error('Unexpected project data format:', response.data);
          throw new Error('Invalid project data format');
        }
        
        // Enhance project data with additional fields if they don't exist
        const enhancedProjectData = {
          ...projectData,
          images: projectData.images || [projectData.coverImage || fallbackProject.coverImage],
          specifications: projectData.specifications || fallbackProject.specifications,
          challenge: projectData.challenge || fallbackProject.challenge,
          solution: projectData.solution || fallbackProject.solution,
          results: projectData.results || fallbackProject.results,
        };
        
        console.log('Project data loaded:', enhancedProjectData.title);
        setProject(enhancedProjectData);
          
        // Fetch related projects from the same category
        if (enhancedProjectData.category) {
          try {
            const relatedResponse = await projectService.getProjectsByCategory(enhancedProjectData.category);
            console.log('Related projects response:', relatedResponse.data);
            
            // Handle different API response formats for related projects
            let relatedProjectsData = [];
            
            if (relatedResponse.data && relatedResponse.data.data && Array.isArray(relatedResponse.data.data)) {
              relatedProjectsData = relatedResponse.data.data;
            } else if (relatedResponse.data && Array.isArray(relatedResponse.data)) {
              relatedProjectsData = relatedResponse.data;
            }
            
            if (relatedProjectsData.length > 0) {
              // Filter out the current project and limit to 3 related projects
              const filteredProjects = relatedProjectsData
                .filter(p => p._id !== enhancedProjectData._id)
                .slice(0, 3);
              console.log('Setting related projects:', filteredProjects.length);
              setRelatedProjects(filteredProjects);
            }
          } catch (relatedError) {
            console.error('Error fetching related projects:', relatedError);
            // Don't set main error for related projects failure
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(fallbackProject);
        setError('Failed to load project data. Showing sample project.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    } else {
      // If no ID provided, use fallback
      setProject(fallbackProject);
      setLoading(false);
    }
  }, [id]);

  // Handle image selection
  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle gallery view
  const toggleGalleryView = () => {
    setGalleryView(!galleryView);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
        <p className="mt-2 text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/projects')} 
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Error notification */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-7xl mx-auto my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-accent-600">Home</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link to="/projects" className="hover:text-accent-600">Projects</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="font-medium text-accent-600 truncate">{project.title}</li>
        </ol>
      </nav>

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button 
          onClick={() => navigate('/projects')} 
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Projects
        </button>
      </div>

      {/* Project details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Images */}
          <div>
            <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
              <img 
                src={project.images && project.images.length > 0 ? 
                  project.images[selectedImage] : project.coverImage} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail gallery */}
            {project.images && project.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {project.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-yellow-green-500' : 'border-transparent'}`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img src={image} alt={`${project.title} ${index + 1}`} className="w-full h-16 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="mr-4">{formatDate(project.completionDate)}</span>
                <span className="mr-4">•</span>
                <span>{project.category}</span>
              </div>
              <div className="flex items-center mb-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-green-100 text-yellow-green-800">
                  {project.location}
                </span>
              </div>
              <div className="prose max-w-none">
                <p>{project.description}</p>
              </div>
            </div>

            {/* Client info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Client</h3>
              <p className="text-gray-600">{project.client}</p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`${activeTab === 'description' ? 'border-yellow-green-500 text-yellow-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('challenge')}
                  className={`${activeTab === 'challenge' ? 'border-yellow-green-500 text-yellow-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Challenge
                </button>
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`${activeTab === 'solution' ? 'border-yellow-green-500 text-yellow-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Solution
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className={`${activeTab === 'results' ? 'border-yellow-green-500 text-yellow-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Results
                </button>
                {project.testimonial && (
                  <button
                    onClick={() => setActiveTab('testimonial')}
                    className={`${activeTab === 'testimonial' ? 'border-yellow-green-500 text-yellow-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Testimonial
                  </button>
                )}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mb-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p>{project.description}</p>
                  
                  {/* Project specifications */}
                  {project.specifications && project.specifications.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Specifications</h3>
                      <ul className="space-y-2">
                        {project.specifications.map((spec, index) => (
                          <li key={index} className="flex items-start">
                            <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'challenge' && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">The Challenge</h3>
                  <p>{project.challenge || 'Challenge details not available.'}</p>
                </div>
              )}
              
              {activeTab === 'solution' && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Our Solution</h3>
                  <p>{project.solution || 'Solution details not available.'}</p>
                </div>
              )}
              
              {activeTab === 'results' && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">The Results</h3>
                  <p>{project.results || 'Results details not available.'}</p>
                </div>
              )}
              
              {activeTab === 'testimonial' && project.testimonial && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Client Testimonial</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-green-500">
                    <p className="italic mb-4">"{project.testimonial.content}"</p>
                    <div className="flex items-center">
                      {project.testimonial.avatar && (
                        <img 
                          src={project.testimonial.avatar} 
                          alt={project.testimonial.name} 
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{project.testimonial.name}</p>
                        <p className="text-sm text-gray-600">{project.testimonial.position}, {project.testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Sharing */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share This Project</h3>
              <div className="flex space-x-4">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing project: ${project.title}`)}&url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(project.title)}&summary=${encodeURIComponent(project.description)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
                  </svg>
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // You could add a toast notification here
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Copy Link</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject) => (
                <div key={relatedProject._id} className="group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={relatedProject.coverImage} 
                      alt={relatedProject.title} 
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    <Link to={`/projects/${relatedProject.slug}`}>
                      <span className="absolute inset-0" />
                      {relatedProject.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{relatedProject.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-yellow-green-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to start your solar journey?</h2>
            <p className="text-gray-600 mb-6">Contact us today for a free consultation and quote.</p>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-yellow-green-600 hover:bg-yellow-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-green-500"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;