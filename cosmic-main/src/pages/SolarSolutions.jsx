import React, { useState, useEffect } from 'react';
import { solarSolutionService } from '../services/solarSolutionService';
import { Link } from 'react-router-dom';

const SolarSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Predefined solution types with images
  const solutionTypes = [
    {
      id: 'epc',
      title: 'EPC',
      image: '/solar-panels.jpg',
      description: 'Complete Engineering, Procurement & Construction services for solar projects',
      link: '/contact'
    },
    {
      id: 'retailer',
      title: 'Retailer',
      image: '/solar1.png',
      description: 'Solar equipment retail solutions for distributors and dealers',
      link: '/contact'
    },
    {
      id: 'installer',
      title: 'Solar Installer',
      image: '/installation.jpg',
      description: 'Professional installation services for all types of solar systems',
      link: '/contact'
    },
    {
      id: 'financing',
      title: 'Financing',
      image: '/quality.jpg',
      description: 'Flexible financing options to make solar accessible for everyone',
      link: '/contact'
    }
  ];

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        console.log('Fetching solar solutions...');
        const response = await solarSolutionService.getActiveSolutions();
        console.log('Solar solutions response:', response);
        if (response.data && response.data.success) {
          console.log('Solar solutions data:', response.data.data);
          setSolutions(response.data.data);
        } else {
          console.error('Failed to fetch solar solutions:', response.data);
          setError('Failed to fetch solar solutions');
        }
      } catch (err) {
        console.error('Error fetching solar solutions:', err);
        setError('An error occurred while fetching solar solutions');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading solar solutions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-green-600 tracking-wide uppercase">★ Diverse Solar Expertise ★</p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Solar Solutions For Every Need
          </h1>
        </div>

        {/* Featured Solution Types - First Row */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {solutionTypes.slice(0, 4).map((type) => (
            <div key={type.id} className="relative group">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-90 transition-all duration-300">
                <img
                  src={type.image}
                  alt={type.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                  <h3 className="text-xl font-semibold text-white">{type.title}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <Link to={type.link} className="absolute inset-0" aria-label={`Learn more about ${type.title}`}></Link>
            </div>
          ))}
        </div>

        {/* Featured Solution Types - Second Row */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {solutionTypes.slice(0, 4).map((type) => (
            <div key={`second-${type.id}`} className="relative group">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-90 transition-all duration-300">
                <img
                  src={type.image}
                  alt={type.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                  <h3 className="text-xl font-semibold text-white">{type.title}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <Link to={type.link} className="absolute inset-0" aria-label={`Learn more about ${type.title}`}></Link>
            </div>
          ))}
        </div>

        {/* Dynamic Solutions from API */}
        {solutions.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Custom Solutions</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {solutions.map((solution) => (
                <div key={solution._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
                  {solution.image && (
                    <div className="h-48 w-full overflow-hidden">
                      <img 
                        src={solution.image.startsWith('http') ? solution.image : `/uploads/${solution.image}`} 
                        alt={solution.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Image load error for:', solution.image);
                          e.target.src = '/solar-panels.jpg'; // Fallback image
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{solution.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {solution.description}
                    </p>
                    {solution.category && (
                      <div className="mt-4">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {solution.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
          >
            Contact Us for Custom Solutions
          </a>
        </div>
      </div>
    </div>
  );
};

export default SolarSolutions;