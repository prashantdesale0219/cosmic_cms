import { useState, useEffect } from 'react';
import { co2EmissionReductionService } from '../services/api';

const CO2Counter = () => {
  const [counter, setCounter] = useState(0);
  const [targetCO2, setTargetCO2] = useState(15000); // Default value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [co2Data, setCO2Data] = useState(null);

  // Fetch CO2 emission reduction data from backend
  useEffect(() => {
    const fetchCO2Data = async () => {
      try {
        setLoading(true);
        const response = await co2EmissionReductionService.getActiveReductions();
        if (response.data && response.data.data && response.data.data.length > 0) {
          const data = response.data.data;
          setCO2Data(data);
          
          // Calculate total CO2 reduction value from all entries
          const totalCO2 = data.reduce((sum, item) => sum + (item.value || 0), 0);
          setTargetCO2(totalCO2 > 0 ? totalCO2 : 15000); // Use fetched value or default
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CO2 emission reduction data:', err);
        setError('Failed to load CO2 emission reduction data');
        setLoading(false);
      }
    };

    fetchCO2Data();
  }, []);

  // Animate counter from 0 to target value
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetCO2 / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCounter(prev => Math.min(prev + increment, targetCO2));
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetCO2]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-yellow-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>Loading CO2 emission reduction data...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-20 bg-yellow-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-300">{error}</p>
        </div>
      </section>
    );
  }

  // Get unit and timeframe from the first CO2 data entry if available
  const unit = co2Data && co2Data.length > 0 ? co2Data[0].unit || 'tons' : 'tons';
  const timeframe = co2Data && co2Data.length > 0 ? co2Data[0].timeframe || 'per year' : 'per year';

  return (
    <section className="py-20 bg-yellow-green-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Our Environmental Impact
        </h2>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-yellow-green-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <svg
                  className="w-32 h-32 text-yellow-green-500 opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.415 2.88-2.88c-.528-.411-1.003-.886-1.414-1.415zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z"/>
                </svg>
                <div className="text-6xl md:text-7xl font-bold mb-2">
                  {Math.round(counter).toLocaleString()}
                  <span className="text-yellow-green-300">+</span>
                </div>
                <p className="text-2xl text-yellow-green-300">Tons of CO₂ Offset</p>
              </div>
              
              <p className="text-xl max-w-2xl">
                Cosmic Powertech Solutions has offset over {Math.round(counter).toLocaleString()} {unit} of CO₂ {timeframe}—thanks to your trust in solar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
                <div className="bg-yellow-green-700 rounded-xl p-6">
                  <div className="text-3xl font-bold text-yellow-green-300 mb-2">≈ {Math.round(counter / 50).toLocaleString()}</div>
                  <p className="text-yellow-green-100">Cars off the road annually</p>
                </div>
                <div className="bg-yellow-green-700 rounded-xl p-6">
                  <div className="text-3xl font-bold text-yellow-green-300 mb-2">≈ {Math.round(counter * 20).toLocaleString()}</div>
                  <p className="text-yellow-green-100">Trees planted equivalent</p>
                </div>
                <div className="bg-yellow-green-700 rounded-xl p-6">
                  <div className="text-3xl font-bold text-yellow-green-300 mb-2">≈ {Math.round(counter * 1.5).toLocaleString()}</div>
                  <p className="text-yellow-green-100">Homes powered annually</p>
                </div>
              </div>

              {/* Display individual CO2 reduction entries if available */}
              {co2Data && co2Data.length > 0 && (
                <div className="mt-8 w-full">
                  <h3 className="text-2xl font-bold mb-4">Our CO2 Reduction Initiatives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {co2Data.map((item) => (
                      <div key={item._id} className="bg-yellow-green-700 rounded-xl p-6 text-left">
                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                        <p className="mb-3">{item.description}</p>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-yellow-green-300 mr-2">{item.value.toLocaleString()}</span>
                          <span>{item.unit} {item.timeframe}</span>
                        </div>
                        {item.methodology && (
                          <p className="mt-2 text-sm text-yellow-green-200">{item.methodology}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
            <a
              href="/calculator"
              className="inline-flex items-center px-8 py-4 bg-yellow-green-500 text-white rounded-full text-lg font-semibold hover:bg-yellow-green-600 transition-colors duration-300"
            >
              Calculate Your Impact
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CO2Counter;