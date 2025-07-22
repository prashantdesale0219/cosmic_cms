import React from 'react';

const Accessories = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Solar Accessories
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Complete your solar installation with our quality accessories
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Mounting Systems */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Mounting Systems</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Secure and adjustable mounting solutions for all roof types
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Aluminum and stainless steel
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Wind and snow load tested
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    20-year warranty
                  </li>
                </ul>
              </div>
            </div>

            {/* Solar Cables */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Solar Cables</h3>
                <p className="mt-2 text-sm text-gray-500">
                  High-quality cables for reliable power transmission
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    UV resistant
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Double insulated
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Temperature resistant
                  </li>
                </ul>
              </div>
            </div>

            {/* Monitoring Systems */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Monitoring Systems</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Real-time monitoring and analytics for your solar system
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mobile app access
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Performance analytics
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Alert notifications
                  </li>
                </ul>
              </div>
            </div>

            {/* Junction Boxes */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Junction Boxes</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Weather-resistant connection boxes for safe wiring
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    IP65 rated
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    UV resistant
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Flame retardant
                  </li>
                </ul>
              </div>
            </div>

            {/* Safety Equipment */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Safety Equipment</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Essential safety gear for installation and maintenance
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    DC circuit breakers
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Surge protection
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Grounding equipment
                  </li>
                </ul>
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Installation Tools</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Professional-grade tools for solar installation
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Specialized wrenches
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Cable crimpers
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Testing equipment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Contact for Pricing
          </a>
        </div>
      </div>
    </div>
  );
};

export default Accessories;