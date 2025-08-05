import React, { useRef, useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  AWARDS DATA                                                       */
/* ------------------------------------------------------------------ */
const awards = [
  {
    year: "2021",
    label: "Best Quality\nAwards",
    tag: "Premium Materials",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    year: "2022",
    label: "Best Design\nAwards",
    tag: "Innovative Aesthetics",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    year: "2023",
    label: "Specific\nAwards",
    tag: "Technical Excellence",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    year: "2024",
    label: "Community\nAwards",
    tag: "Social Impact",
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */
const AwardsTimeline = () => {
  const [current, setCurrent] = useState(0);

  /* ----------- mobile/tablet check ----------- */
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ----------- refs & helpers ----------- */
  const sliderRef = useRef(null);
  const slideWidth = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (!sliderRef.current) return;
      const first = sliderRef.current.querySelector(".slide");
      if (first) slideWidth.current = first.offsetWidth + 24; // 24 = gap
      goTo(current, false);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (idx, smooth = true) => {
    setCurrent(idx);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: slideWidth.current * idx,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };
  const next = () => goTo((current + 1) % awards.length);
  const prev = () => goTo((current - 1 + awards.length) % awards.length);

  /* ----------- auto-slide on mobile/tablet ----------- */
  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [isMobile, current]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="mb-10">
      {/* ---------- title block ---------- */}
      <div className="py-16 pb-0 px-4 text-center ">
        <p className="text-gray-600 mb-2 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2 font-['Space_Grotesk'] font-[700]">
          We Are Solar Experts
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Space_Grotesk']">
          Reliable, Award-Winning Solar<br />Solutions!
        </h2>
      </div>

      {/* ---------- timeline ---------- */}
      <div className="relative mt-0 md:mt-8 lg:mt-16">
        {/* desktop guide line */}
        <div className="hidden lg:block absolute top-[5%] left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />

        {/* ---------------- DESKTOP CARDS ---------------- */}
        <div className="hidden lg:flex justify-between items-start relative z-10">
          {awards.map(({ year, label, Icon }) => (
            <div key={year} className="flex flex-col items-center w-1/4 group">
              <div className="w-4 h-4 bg-gray-50 border-4 border-[#cae28e] rounded-full mb-4 transition-transform duration-500 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-green-200" />
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <h3 className="text-5xl font-bold text-gray-900 mb-2 lg:mb-0 lg:-rotate-90 lg:origin-right lg:translate-x-2 lg:-translate-y-4 transition-colors duration-300 group-hover:text-[#cae28e] font-['Space_Grotesk']">
                  {year}
                </h3>
                <div className="text-center lg:ml-6 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <div className="flex justify-center mb-3 transition-transform duration-500 group-hover:rotate-12 text-gray-600 group-hover:text-[#cae28e]">
                    <Icon />
                  </div>
                  <p className="whitespace-pre-line ps-5 text-gray-700 font-medium transition-colors duration-300 group-hover:font-bold font-['Space_Grotesk']">
                    {label}
                  </p>
                  <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden mt-8">
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- MOBILE / TABLET SLIDER ---------------- */}
        <div className="block lg:hidden mt-10">
          <div ref={sliderRef} className="overflow-x-auto pb-10 hide-scrollbar">
            <div className="flex space-x-6 w-max">
              {awards.map(({ year, label, Icon }) => (
                <div
                  key={year}
                  className="slide w-80 ms-5 shadow-md hover:shadow-xl transition-transform duration-500 transform group hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center px-8 py-12">
                    <div className="text-gray-700 mb-6 group-hover:text-[#cae28e] transition-colors duration-300">
                      <Icon />
                    </div>
                    <h3 className="text-5xl font-bold text-gray-900 mb-2 font-['Space_Grotesk'] group-hover:text-[#cae28e]">
                      {year}
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 group-hover:text-[#cae28e]">
                      {label.replace(/\n/g, " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsTimeline;
