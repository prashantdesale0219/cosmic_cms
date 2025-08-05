/*  src/pages/Home.jsx  */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SmartEnergySolutions from "../components/SmartEnergySolutions";
import Portfolio from "../components/Portfolio";
import SolarJourney from "../components/SolarJourney";
import FaqSection from "../components/FaqSection";
import CO2Section from "../components/CO2Section";
import CO2Counter from "../components/CO2Counter";
import CompanyIntro from "../components/CompanyIntro";
import VideoHero from "../components/VideoHero";
import TimelineSection from "../components/TimelineSection";
import TestimonialVideo from "../components/TestimonialVideo";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  // Get data and functions from context
  const { 
    fetchHomepageData, 
    heroSlides,
    energySolutions,
    products,
    projects,
    testimonials,
    teamMembers,
    blogPosts,
    faqs,
    settings,
    loading 
  } = useAppContext();
  
  // Fetch homepage data when component mounts
  useEffect(() => {
    fetchHomepageData();
  }, []);
  
  // Fallback solutions data if API fails
  const fallbackSolutions = [
    {
      title: "Residential",
      description: "Perfect for homes and small properties",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      link: "/products/solar-panels",
    },
    {
      title: "Commercial",
      description: "Ideal for businesses and organizations",
      image:
        "https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=800&q=80",
      link: "/solutions",
    },
    {
      title: "Industrial",
      description: "Large-scale solar power plants",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      link: "/solutions",
    },
  ];
  
  // Use API data or fallback to static data
  const solutions = energySolutions && energySolutions.length > 0 ? energySolutions : fallbackSolutions;

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-[-1]"
        style={{
          backgroundImage: 'url("/back_Image.avif")',
          opacity: 0.5,
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="flex flex-col w-full">
        {/* ---------- Hero ---------- */}
        <Hero />

        {/* ---------- Smart Energy Solutions ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <SmartEnergySolutions />
        </div>

        {/* ---------- CompanyIntro ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <CompanyIntro />
        </div>

        {/* ---------- Portfolio ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <Portfolio />
        </div>

        {/* ---------- VideoHero ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <VideoHero />
        </div>
        {/* ---------- Timeline ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <TimelineSection />
        </div>
        
        {/* ---------- TestimonialVideo ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <TestimonialVideo />
        </div>

       
        {/* ---------- CO2Section ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <CO2Section />
        </div>
        
       
         {/* ---------- SolarJourney ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <SolarJourney />
        </div>


        {/* ---------- FAQ Section ---------- */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <FaqSection />
        </div>

        

        {/* ---------- Solar Solutions ---------- */}
        <section className="w-full bg-white py-12 sm:py-16 md:py-20 mt-8 sm:mt-12 md:mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12 md:mb-16 text-center">
            </div>

            {/* <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {solutions.map((s) => (
                <div
                  key={s.title}
                  className="group relative h-80 sm:h-96 overflow-hidden rounded-2xl shadow-lg transition hover:scale-105"
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black to-transparent opacity-70" />
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6">
                    <h3 className="mb-2 text-xl sm:text-2xl font-bold text-white">
                      {s.title}
                    </h3>
                    <p className="mb-3 sm:mb-4 text-yellow-green-100 opacity-90 text-sm sm:text-base">
                      {s.description}
                    </p>
                    <Link
                      to={s.link}
                      className="inline-flex items-center rounded-full bg-yellow-green-400 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-yellow-green-950 transition hover:bg-yellow-green-500"
                    >
                      Learn more
                      <svg
                        className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
