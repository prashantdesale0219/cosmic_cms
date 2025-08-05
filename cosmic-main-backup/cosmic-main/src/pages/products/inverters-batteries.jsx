import React from 'react';

const InvertersBatteries = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Inverters & Batteries
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            High-performance inverters and reliable battery storage solutions
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Solar Inverters</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* String Inverter */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">String Inverter</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Efficient power conversion for residential and small commercial installations
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    98.5% maximum efficiency
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Built-in monitoring
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    10-year warranty
                  </li>
                </ul>
              </div>
            </div>

            {/* Microinverter */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Microinverter</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Panel-level power conversion for maximum energy harvest
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    97% maximum efficiency
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Individual panel monitoring
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    25-year warranty
                  </li>
                </ul>
              </div>
            </div>

            {/* Hybrid Inverter */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Hybrid Inverter</h3>
                <p className="mt-2 text-sm text-gray-500">
                  All-in-one solution for solar and battery storage
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    96% maximum efficiency
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Battery ready
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    15-year warranty
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Battery Storage</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Lithium Battery */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Lithium Battery Storage</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Advanced lithium-ion technology for reliable energy storage
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    10+ year lifespan
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Scalable capacity
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Smart monitoring
                  </li>
                </ul>
              </div>
            </div>

            {/* Lead Acid Battery */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Lead Acid Battery Storage</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Cost-effective solution for backup power needs
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    5-7 year lifespan
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Proven technology
                  </li>
                  <li className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Low maintenance
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
            Request a Quote
          </a>
        </div>
      </div>
    </div>
  );
};

export default InvertersBatteries;
