// src/pages/About.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AwardsTimeline from "../components/AwardsTimeline";
import ServicesSection from "../components/ServicesSection";
import SolarDesignSection from "../components/SolarDesignSection";
import TeamSection from "../components/TeamSection";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const About = () => {
  const stats = [
    { number: "14K+", label: "Installations" },
    { number: "16K+", label: "Commercial Projects" },
    { number: "345+", label: "Residential Projects" },
    { number: "100+", label: "Happy Customers" },
    { number: "15+", label: "Industry Experience" },
  ];

  const [currentStat, setCurrentStat] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(
      () => setCurrentStat((p) => (p + 1) % stats.length),
      3000
    );
    return () => clearInterval(id);
  }, [isMobile, stats.length]);

  const next = () => setCurrentStat((p) => (p + 1) % stats.length);
  const prev = () => setCurrentStat((p) => (p - 1 + stats.length) % stats.length);

  return (
    <div className="min-h-screen font-['Space_Grotesk']">
      {/* HERO SECTION */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-[300px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About</h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-green-400 transition">
              Home
            </Link>
            <span>—</span>
            <span className="text-green-400">About</span>
          </nav>
        </div>
      </motion.header>

      {/* WHY CHOOSE US SECTION */}
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
            className="mb-12"
          >
            <p className="text-gray-600 mb-3 text-left ms-0 sm:ms-12 relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-snug space-y-2">
              <span className="block sm:inline">
                Smart Energy Solutions,&nbsp;
                <span className="inline-flex items-baseline">
                  High-Quality&nbsp;
                  <img
                    src="https://zolar.wpengine.com/wp-content/uploads/2024/12/Home1-textwithimg-1.png"
                    alt="Solar Goods"
                    className="h-8 sm:h-10 md:h-12 inline"
                  />
                  &nbsp;Solar Goods,
                </span>
              </span>
              <br className="hidden md:block" />
              <span className="block sm:inline">
                And Skilled Service—Helping You&nbsp;
                <span className="inline-flex items-baseline">
                  <img
                    src="https://zolar.wpengine.com/wp-content/uploads/2024/12/Home1-textwithimg-2.png"
                    alt="Create A"
                    className="h-8 sm:h-10 md:h-12 inline"
                  />
                  &nbsp;Create A Sustainable&nbsp;
                </span>
                And Cost-Effective Future
              </span>
            </h2>
          </motion.header>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:hidden flex flex-col items-center mt-12"
          >
            <div className="bg-[#F2F8F5] w-full max-w-xs sm:max-w-sm rounded-md px-8 py-8 shadow text-center">
              <h3 className="text-5xl font-bold text-gray-900 mb-2">
                {stats[currentStat].number}
              </h3>
              <p className="text-gray-700 text-base">{stats[currentStat].label}</p>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={prev} className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-[#cae28e] flex items-center justify-center hover:bg-[#b6d97b] transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={next} className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-[#cae28e] flex items-center justify-center hover:bg-[#b6d97b] transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="hidden lg:grid lg:grid-cols-5 gap-6 text-center mt-16 border-t border-gray-200 pt-12"
          >
            {stats.map((stat, idx) => (
              <div key={stat.label} className={idx !== stats.length - 1 ? "border-r border-gray-200" : ""}>
                <h3 className="text-5xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <ServicesSection />
      </motion.div>

      <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <SolarDesignSection />
      </motion.div>

      <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <AwardsTimeline />
      </motion.div>

      <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <TeamSection />
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariant}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <article className="prose max-w-3xl mx-auto prose-gray">
          <h2 className="text-center !font-bold">About Cosmic Solar Tech</h2>
          <p>
            At Cosmic Solar Tech, we are dedicated to providing innovative solar
            solutions that help our clients reduce their carbon footprint while
            saving on energy costs. Our team of experts is committed to
            excellence in every project we undertake.
          </p>
          <p>
            Founded with a vision to make renewable energy accessible to all, we
            have grown to become a leading provider of solar technology
            solutions in the region. Our approach combines cutting-edge
            technology with sustainable practices to deliver results that exceed
            expectations.
          </p>
          <p>
            We believe in a greener future powered by clean energy. Join us in
            our mission to transform how the world generates and consumes
            energy, one solar panel at a time.
          </p>
        </article>
      </motion.section>
    </div>
  );
};

export default About;
