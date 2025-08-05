import { useState, useEffect } from 'react';
import axios from 'axios';

const useAboutData = () => {
  const [aboutData, setAboutData] = useState({
    hero: null,
    aboutUs: null,
    whoWeAre: null,
    ourExpertise: null,
    whyChooseCosmic: null,
    visionMissionValues: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        
        // Fetch all about data from API
        const response = await axios.get('/api/about/all');
        const data = response.data.data;
        
        setAboutData({
          hero: data.aboutHero,
          aboutUs: data.aboutUs,
          whoWeAre: data.whoWeAre,
          ourExpertise: data.ourExpertise,
          whyChooseCosmic: data.whyChooseCosmic,
          visionMissionValues: data.visionMissionValues
        });
        
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err.message);
        
        // Fallback to static data if API fails
        setAboutData({
          hero: {
            title: "About",
            videoUrl: "/aboutvideo.mp4",
            breadcrumbs: [
              { name: "Home", href: "/" },
              { name: "About", href: "/about" }
            ]
          },
          aboutUs: {
            title: "About Us :",
            description: "Cosmic Powertech is a leading solar energy company dedicated to providing innovative and sustainable solar solutions across India. With a commitment to excellence and environmental responsibility, we specialize in designing, installing, and maintaining solar power systems for residential, commercial, and industrial clients.",
            additionalDescription: "Our team of experienced professionals works tirelessly to deliver customized solar solutions that meet the unique energy needs of our clients while contributing to a greener future. We believe in harnessing the power of the sun to create a sustainable tomorrow."
          },
          whoWeAre: {
            title: "Who we are?",
            description: "We are a team of passionate professionals committed to revolutionizing the energy sector through innovative solar solutions. Our expertise spans across various industries, and we take pride in our ability to deliver tailored solutions that exceed expectations.",
            features: [
              "Expert team of solar professionals",
              "Nationwide service coverage",
              "Customized solutions for every need",
              "Commitment to sustainability"
            ]
          },
          ourExpertise: {
            title: "Our Expertise",
            description: "We serve diverse industries with specialized solar solutions",
            industries: [
              { name: "Textiles", image: "/images/industries/textiles.jpg" },
              { name: "Paper Packaging", image: "/images/industries/paper.jpg" },
              { name: "Hospital", image: "/images/industries/hospital.jpg" },
              { name: "Automobile", image: "/images/industries/automobile.jpg" },
              { name: "Oil and Gas", image: "/images/industries/oil-gas.jpg" },
              { name: "Mining", image: "/images/industries/mining.jpg" },
              { name: "Tourism", image: "/images/industries/tourism.jpg" },
              { name: "Private and Government Sector", image: "/images/industries/government.jpg" },
              { name: "Pharmaceuticals", image: "/images/industries/pharma.jpg" },
              { name: "IT", image: "/images/industries/it.jpg" },
              { name: "Gems and Jewellery", image: "/images/industries/gems.jpg" }
            ]
          },
          whyChooseCosmic: {
            title: "Why Choose Cosmic?",
            features: [
              {
                title: "Nationwide Reach",
                description: "Comprehensive coverage across India with local expertise.",
                icon: "globe"
              },
              {
                title: "Diverse Portfolio",
                description: "Extensive experience across multiple industry sectors.",
                icon: "portfolio"
              },
              {
                title: "Expert Team",
                description: "A workforce of 1,000+ professionals dedicated to your success.",
                icon: "team"
              },
              {
                title: "Customer Focus",
                description: "Tailored solutions for every industry segment.",
                icon: "customer"
              },
              {
                title: "Quality Assurance",
                description: "We never compromise on the quality of products and services we offer.",
                icon: "quality"
              }
            ]
          },
          visionMissionValues: {
            vision: {
              title: "Vision",
              description: "Cosmic Powertech envisions a world where sustainable living is second nature, driven by the widespread adoption of clean, abundant renewable energy. We dedicate ourselves to crafting tailored solar solutions that precisely address the distinctive requirements of every household, business, and industry we serve, while simultaneously advancing a healthier planet."
            },
            mission: {
              title: "Mission",
              description: "The dedication to achieve our vision is a reflected in our mission to make solar power accessible and affordable, thereby enabling individuals and businesses to participate actively in the global shift towards sustainability."
            },
            values: {
              title: "Value",
              description: "At Cosmic Powertech, our values are rooted in sustainability, innovation, and people-first service. We are committed to making solar energy accessible and affordable, empowering individuals and businesses to join India's green revolution."
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return { aboutData, loading, error };
};

export default useAboutData;