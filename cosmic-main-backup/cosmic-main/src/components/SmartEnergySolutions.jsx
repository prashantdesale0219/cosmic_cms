// src/components/SmartEnergySolutions.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import {
  HomeModernIcon,
  BoltIcon,
  TruckIcon,
  BuildingOffice2Icon,
  Battery100Icon,
  ArrowUpRightIcon
} from "@heroicons/react/24/outline";

// Map icons to feature types
const iconMap = {
  "rooftop": HomeModernIcon,
  "ev": BoltIcon,
  "rural": TruckIcon,
  "industrial": BuildingOffice2Icon,
  "concentrated": Battery100Icon,
  "default": HomeModernIcon
};

// Fallback features if API fails
const fallbackFeatures = [
  {
    title: "Rooftop Solar",
    Icon: HomeModernIcon,
    img:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Solar EV Chargers",
    Icon: BoltIcon,
    img:
      "https://images.unsplash.com/photo-1543328721-cd7f2a85c433?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Rural Solar Solutions",
    Icon: TruckIcon,
    img:
      "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Industrial Solar",
    Icon: BuildingOffice2Icon,
    img:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Concentrated Solar",
    Icon: Battery100Icon,
    img:
      "https://images.unsplash.com/photo-1502052399018-77dd3ec62b07?auto=format&fit=crop&w=1600&q=80"
  }
];

const ROTATE_MS = 5000;

export default function SmartEnergySolutions() {
  const { energySolutions, loading } = useAppContext();
  const [active, setActive] = useState(2);
  const timerRef = useRef(null);
  
  // Use API data or fallback to static data
  const features = energySolutions && energySolutions.length > 0
    ? energySolutions.map(solution => ({
        title: solution.title,
        Icon: iconMap[solution.type?.toLowerCase()] || iconMap.default,
        img: solution.image || fallbackFeatures[0].img
      }))
    : fallbackFeatures;

  const startTimer = () =>
    (timerRef.current = setInterval(
      () => setActive((i) => (i + 1) % features.length),
      ROTATE_MS
    ));
  const stopTimer = () => clearInterval(timerRef.current);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  return (
    <section className="relative bg-[#f3faf6] py-24">
      <img
        src="https://images.unsplash.com/photo-1509395107-0ebd10a326dd?auto=format&fit=crop&w=900&q=80"
        alt=""
        className="pointer-events-none select-none absolute left-4 bottom-0 w-[600px] max-w-[70vw] rounded-2xl"
      />

      <div className="mx-auto max-w-[1700px] px-6 lg:pl-10 lg:pr-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-3">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700 font-space-grotesk">
              <span className="h-px flex-1 bg-gray-400" /> ✷ Cleaner Future ✷{" "}
              <span className="h-px flex-1 bg-gray-400" />
            </p>
            <h2 className="mb-8 text-[48px] leading-[1.1] font-extrabold text-gray-900 font-space-grotesk">
              Smart Power
              <br />
              Solutions
            </h2>

            <Link
              to="/services"
              className="group relative overflow-hidden inline-flex items-center gap-3 rounded-full bg-lime-300/70 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm border-2 border-transparent hover:border-[#cae28e] transition-all duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">All Services</span>
              <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-900 text-white group-hover:bg-[#cae28e] transition-all duration-300 relative z-10">
                <ArrowUpRightIcon className="h-4 w-4 group-hover:text-black transition-all duration-300" />
              </span>
            </Link>
          </div>

          {/* MIDDLE – feature list */}
          <div className="lg:col-span-4 space-y-2">
            {features.map(({ title, Icon }, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={title}
                  onMouseEnter={() => {
                    stopTimer();
                    setActive(i);
                  }}
                  onMouseLeave={startTimer}
                  onClick={() => setActive(i)}
                  initial={{ opacity: isActive ? 1 : 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.02 : 1
                  }}
                  whileHover={{ scale: isActive ? 1.04 : 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex w-full items-center justify-between gap-4 py-7 pl-8 pr-6 text-left text-xl font-semibold font-space-grotesk ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-900 hover:text-gray-900/80"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-bar"
                      className="absolute left-0 top-0 h-full w-1.5 bg-lime-400"
                    />
                  )}
                  <Icon
                    className={`h-9 w-9 flex-shrink-0 ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  />
                  <span className="flex-1">{title}</span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid h-11 w-11 place-items-center rounded-full bg-lime-300/90"
                      >
                        <ArrowUpRightIcon className="h-5 w-5 text-gray-900" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* RIGHT – hero */}
          <figure className="relative col-span-full h-[560px] overflow-hidden shadow-lg lg:col-span-5 rounded-3xl">
            <AnimatePresence mode="wait">
              {features.map((f, idx) =>
                idx === active ? (
                  <motion.img
                    key={f.title}
                    src={f.img}
                    alt={f.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : null
              )}
            </AnimatePresence>
          </figure>
        </div>
      </div>
    </section>
  );
}
