/* src/components/Portfolio.jsx */
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const { solarSolutions, loading } = useAppContext();
  
  // Log solar solutions data for debugging
  console.log('Solar Solutions in Portfolio component:', solarSolutions);
  
  // Fallback items if API fails - These will be displayed if the API call fails
  const fallbackItems = [
    {
      title: "EPC Solar Solutions",
      tag: "Commercial",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-01.jpg",
      span: "lg:col-span-3",
      slug: "epc-solar-solutions"
    },
    {
      title: "Retail Solar Systems",
      tag: "Business",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-01.jpg",
      span: "lg:col-span-3",
      slug: "retail-solar-systems"
    },
    {
      title: "Professional Solar Installation",
      tag: "Services",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-02.jpg",
      span: "lg:col-span-3",
      slug: "professional-solar-installation"
    },
    {
      title: "Floating Solar Arrays",
      tag: "Innovation",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-02.jpg",
      span: "lg:col-span-3",
      slug: "floating-solar-arrays"
    },
    {
      title: "Commercial & Industrial Solar",
      tag: "Enterprise",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-01.jpg",
      span: "lg:col-span-3",
      slug: "commercial-industrial-solar"
    },
    {
      title: "Rooftop Solar Systems",
      tag: "Residential",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-01.jpg",
      span: "lg:col-span-3",
      slug: "rooftop-solar-systems"
    },
    {
      title: "Home Solar Solutions",
      tag: "Residential",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-02.jpg",
      span: "lg:col-span-3",
      slug: "home-solar-solutions"
    },
    {
      title: "Consumer Solar Products",
      tag: "Retail",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-02.jpg",
      span: "lg:col-span-3",
      slug: "consumer-solar-products"
    },
  ];
  
  // Define uniform span classes for grid layout
  const spanClasses = [
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3"
  ];
  
  // Use API data or fallback to static data
  const items = solarSolutions && solarSolutions.length > 0
    ? solarSolutions.slice(0, 8).map((solution, index) => ({
        tag: solution.category?.name || "Solar Solution",
        title: solution.title,
        img: solution.image || fallbackItems[index % fallbackItems.length].img,
        span: spanClasses[index % spanClasses.length],
        id: solution._id,
        slug: solution.slug
      }))
    : fallbackItems;

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16">
      {/* topo pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://raw.githubusercontent.com/stevenlei/design-bg-samples/master/topography.svg')] bg-cover opacity-5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <p className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 font-space-grotesk">
            <span className="h-px w-8 bg-gray-400" />
            ✷ Diverse Solar Expertise ✷
            <span className="h-px w-8 bg-gray-400" />
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl font-space-grotesk">
            Solar Solutions For Every Need
          </h2>
        </motion.header>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 solar-grid-container">
          {items.map(({ img, tag, title }, i) => (
            <motion.article
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              key={title}
              className="group relative flex overflow-hidden rounded-2xl h-[250px] sm:h-[280px] md:h-[300px] solar-grid-item"
            >
              <img
                src={img && img.startsWith('http') ? img : img ? `/uploads/${img}` : fallbackItems[i % fallbackItems.length].img}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  console.error(`Error loading image: ${img}`);
                  e.target.src = fallbackItems[i % fallbackItems.length].img;
                }}
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-70" />

              {/* arrow */}
              <Link to={`/solar-solutions/${items[i].slug || i}`} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-lime-300/90 text-gray-900 transition-transform group-hover:rotate-45">
                <ArrowUpRightIcon className="h-5 w-5" />
              </Link>

              {/* caption */}
              <Link to={`/solar-solutions/${items[i].slug || i}`} className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs uppercase tracking-wider text-lime-200 font-space-grotesk">
                  {tag}
                </p>
                <h3 className="mt-1 text-lg sm:text-xl md:text-2xl font-bold leading-tight font-space-grotesk line-clamp-2">
                  {title}
                </h3>
              </Link>
            </motion.article>
          ))}
        </div>
        
        {/* Add CSS for hover effect */}
        <style>
          {`
            .solar-grid-container:hover .solar-grid-item:not(:hover) {
              filter: brightness(0.6) contrast(1.2) saturate(0.8) blur(1px);
              position: relative;
            }
            
            .solar-grid-container:hover .solar-grid-item:not(:hover)::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, rgba(0, 62, 99, 0.7), rgba(0, 120, 215, 0.7), rgba(0, 80, 170, 0.7));
              z-index: 1;
              pointer-events: none;
              transition: all 0.4s ease;
              border-radius: 1rem;
              backdrop-filter: blur(1px);
              animation: gradientShift 3s infinite alternate;
            }
            
            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 100% 50%;
              }
            }
            
            .solar-grid-item {
              transition: all 0.4s ease;
              position: relative;
              overflow: hidden;
            }
            
            .solar-grid-container:hover .solar-grid-item:hover {
              transform: scale(1.05);
              z-index: 2;
              box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.4);
            }
            
            .solar-grid-container:hover .solar-grid-item:hover img {
              filter: contrast(1.1) brightness(1.05);
            }
          `}
        </style>
      </div>
    </section>
  );
}
