// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AwardsTimeline from "../components/AwardsTimeline";
import ServicesSection from "../components/ServicesSection";
import SolarDesignSection from "../components/SolarDesignSection";
import TeamSection from "../components/TeamSection";
import Testimonials from "../components/Testimonials";
import { FaCheck } from "react-icons/fa";
import { Helmet } from "react-helmet";
import useAboutData from "../hooks/useAboutData";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const About = () => {
  const { aboutData, loading, error } = useAboutData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* HERO SECTION */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative h-100 sm:h-80 md:h-[500px] flex items-center justify-center overflow-hidden"
      >
        <video 
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src={aboutData.hero?.videoUrl || "/aboutvideo.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{aboutData.hero?.title || "About"}</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            {aboutData.hero?.breadcrumbs?.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>—</span>}
                {breadcrumb.href ? (
                  <Link to={breadcrumb.href} className="hover:text-accent-500 transition">
                    {breadcrumb.name}
                  </Link>
                ) : (
                  <span className="text-accent-500">{breadcrumb.name}</span>
                )}
              </React.Fragment>
            )) || (
              <>
                <Link to="/" className="hover:text-accent-500 transition">
                  Home
                </Link>
                <span>—</span>
                <span className="text-accent-500">About</span>
              </>
            )}
          </nav>
        </div>
      </motion.header>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="bg-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.header
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData.aboutUs?.title || "About Us :"}
            </h2>
            <p>
              {aboutData.aboutUs?.description || "Cosmic Powertech is a Surat-based solar energy company founded in 2018 by brothers Chaitanya Shah and Charchil Shah. Established with the vision of making clean energy accessible and affordable across India, the company has rapidly emerged as a trusted provider of end-to-end renewable energy solutions for both residential and commercial sectors."}
            </p>
            {aboutData.aboutUs?.additionalDescription ? (
              <p>
                {aboutData.aboutUs.additionalDescription}
              </p>
            ) : (
              <p>
                Specializing in a diverse portfolio that includes rooftop solar
                installations, ongrid and off-grid power plants, solar water
                heaters, and custom solutions for industries such as textiles,
                hospitality, pharmaceuticals, petroleum, FMCG, PACKAGING. Cosmic
                Powertech offers comprehensive services from initial consultation
                to installation and long-term maintenance. Their in-house team of
                skilled engineers and sales professionals ensure high- quality
                execution and unmatched responsiveness, positioning the company to
                meet the evolving demands of India's growing solar market.{" "}
              </p>
            )}
          </motion.header>

          <motion.header
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData.whoWeAre?.title || "Who we are ?"}
            </h2>
            <p>
              {aboutData.whoWeAre?.description || "Cosmic Powertech is a Surat-based solar energy company transforming the way India powers its future. Founded by Chaitanya and Charchil Shah, we specialize in end-to-end renewable energy solutions—rooftop systems, solar water heaters, and on/off-grid power plants—designed for homes, industries, and commercial spaces. With a focus on quality, affordability, and long-term service, we make clean energy reliable and accessible across India."}
            </p>

            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </motion.header>
          {/* Our Expertise Grid Section */}

          <motion.header
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4">
              {aboutData.ourExpertise?.title || "Our Expertise"}
            </h2>
            <p>
              {aboutData.ourExpertise?.subtitle || "We are hands down our expertise in product distributorship."}
            </p>

            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </motion.header>
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(aboutData.ourExpertise?.industries || [
                { name: "Textiles", image: "/back_Image.avif" },
                { name: "Paper Packaging", image: "/back_Image.avif" },
                { name: "Hospital", image: "/back_Image.avif" },
                { name: "Automobile", image: "/back_Image.avif" },
                { name: "Banking", image: "/back_Image.avif" },
                { name: "Chemicals", image: "/back_Image.avif" },
                { name: "Diary Industry", image: "/back_Image.avif" },
                { name: "Agriculture", image: "/back_Image.avif" },
                { name: "Education", image: "/back_Image.avif" },
                { name: "FMCG", image: "/back_Image.avif" },
                { name: "Oil and Gas", image: "/back_Image.avif" },
                { name: "Mining Industry", image: "/back_Image.avif" },
                { name: "Tourism", image: "/back_Image.avif" },
                { name: "Private and Government Sector", image: "/back_Image.avif" },
                { name: "Pharmaceuticals", image: "/back_Image.avif" },
                { name: "IT", image: "/back_Image.avif" },
                { name: "Gems and Jewellery", image: "/back_Image.avif" }
              ]).map((industry, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-52">
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={industry.image || "/back_Image.avif"}
                      alt={`${industry.name} Industry`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h4 className="text-white font-bold text-lg">
                        {industry.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Cosmic? Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-700">
              {aboutData.whyChooseCosmic?.title || "Why Choose"} <span className="text-accent-500">{aboutData.whyChooseCosmic?.highlight || "Cosmic"}</span>?
            </h2>
            <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {(aboutData.whyChooseCosmic?.features || [
              {
                title: "Nationwide Reach",
                description: "A vast network across 100+ cities.",
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              },
              {
                title: "Diverse Portfolio",
                description: "Products spanning 40+ categories.",
                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              },
              {
                title: "Expert Team",
                description: "A workforce of 1,000+ professionals dedicated to your success.",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              },
              {
                title: "Customer Focus",
                description: "Tailored solutions for every industry segment.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              },
              {
                title: "Quality Assurance",
                description: "We never compromise on the quality of products and services we offer.",
                icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              }
            ]).map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <div className="bg-white p-4 rounded-full shadow-md mb-4 w-20 h-20 flex items-center justify-center text-accent-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SolarDesignSection />
      </motion.div>

      

      {/* vision mission section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="bg-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Vision */}
            <motion.div variants={fadeUpVariant} className="text-left bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{aboutData.visionMissionValues?.vision?.title || "Vision"}</h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {aboutData.visionMissionValues?.vision?.description || "Our pledge reaches far beyond routine operations; it infuses each consultation, installation, and maintenance visit with purpose, ensuring measurable, long-term impact. Guided by an unwavering belief in a future powered exclusively by renewable resources, we continually innovate, educate, and collaborate to accelerate India's transition toward carbon-free prosperity and global clean-energy leadership."}
                </p>
               
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div variants={fadeUpVariant} className="text-left bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{aboutData.visionMissionValues?.mission?.title || "Mission"}</h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {aboutData.visionMissionValues?.mission?.description || "The dedication to achieve our vision is a reflected in our mission to make solar power accessible and affordable, thereby enabling individuals and businesses to participate actively in the global shift towards sustainability. By integrating advanced technology with personalized service, we aim to empower communities to harness solar energy effectively, reducing reliance on fossil fuels and promoting environmental stewardship. Our efforts are aligned with broader initiatives to mitigate climate change and support India's green energy goals, including the ambitious target of achieving 500 GW of renewable energy capacity by 2030. Through our unwavering focus on quality, innovation, and customer satisfaction, Cosmic Powertech aspires to be a leading force in the renewable energy, driving positive change and contributing to a sustainable future for all."}
                </p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div variants={fadeUpVariant} className="text-left bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{aboutData.visionMissionValues?.values?.title || "Value"}</h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {aboutData.visionMissionValues?.values?.description || "At Cosmic Powertech, our values are rooted in sustainability, innovation, and people-first service. We are committed to making solar energy accessible and affordable, empowering individuals and businesses to join India's green revolution. By integrating advanced technology with customized solutions, we help reduce dependence on fossil fuels and contribute to the nation's goal of 500 GW renewable energy by 2030. Every project reflects our dedication to climate action, engineering excellence, and long-term reliability. With a team driven by integrity and purpose, we deliver clean energy solutions that not only power homes and industries but also inspire a sustainable, greener future."}
                </p>
               
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-26 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="container mx-auto w-1000">
          <Testimonials />
        </div>
      </motion.section>


    </div>
  );
};

export default About;
