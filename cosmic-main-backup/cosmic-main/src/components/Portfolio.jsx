/* src/components/Portfolio.jsx */
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const { projects, loading } = useAppContext();
  
  // Fallback items if API fails
  const fallbackItems = [
    {
      tag: "Transformations",
      title: "Smart Solar Installations",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-01.jpg",
      span: "lg:col-span-6 lg:row-span-2",
    },
    {
      tag: "Urban Rooftops",
      title: "City Skyline Arrays",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-01.jpg",
      span: "lg:col-span-6",
    },
    {
      tag: "Commercial",
      title: "Corporate HQ Solar",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-2-02.jpg",
      span: "lg:col-span-6 lg:row-span-2",
    },
    {
      tag: "Agriculture",
      title: "Farm-scale PV",
      img: "https://zolar.wpengine.com/wp-content/uploads/2024/07/portfolio-detail-1-02.jpg",
      span: "lg:col-span-6",
    },
  ];
  
  // Define span classes for grid layout
  const spanClasses = [
    "lg:col-span-6 lg:row-span-2",
    "lg:col-span-6",
    "lg:col-span-6 lg:row-span-2",
    "lg:col-span-6"
  ];
  
  // Use API data or fallback to static data
  const items = projects && projects.length > 0
    ? projects.slice(0, 4).map((project, index) => ({
        tag: project.category?.name || "Project",
        title: project.title,
        img: project.featuredImage || project.image || fallbackItems[index % fallbackItems.length].img,
        span: spanClasses[index % spanClasses.length]
      }))
    : fallbackItems;

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-white py-16">
      {/* topo pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://raw.githubusercontent.com/stevenlei/design-bg-samples/master/topography.svg')] bg-cover opacity-5" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
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
            ✷ Showcasing Success ✷
            <span className="h-px w-8 bg-gray-400" />
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl font-space-grotesk">
            Portfolio Of Solar Success
          </h2>
        </motion.header>

        {/* grid */}
        <div className="grid auto-rows-[240px] grid-cols-1 gap-6 lg:grid-cols-12">
          {items.map(({ img, tag, title, span }, i) => (
            <motion.article
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              key={title}
              className={`group relative flex overflow-hidden rounded-2xl ${span}`}
            >
              <img
                src={img}
                alt={title}
                className={`h-full w-full object-cover transition-transform duration-500 ${
                  i === 0
                    ? "filter grayscale-1 group-hover:grayscale-0"
                    : "group-hover:scale-105"
                }`}
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-60" />

              {/* arrow */}
              <Link to={`/projects/${projects && projects[i] ? projects[i]._id : i}`} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-lime-300/90 text-gray-900 transition-transform group-hover:rotate-45">
                <ArrowUpRightIcon className="h-6 w-6" />
              </Link>

              {/* caption */}
              <Link to={`/projects/${projects && projects[i] ? projects[i]._id : i}`} className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-wider text-lime-200 font-space-grotesk">
                  {tag}
                </p>
                <h3 className="mt-1 text-2xl font-bold leading-tight font-space-grotesk">
                  {title}
                </h3>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
