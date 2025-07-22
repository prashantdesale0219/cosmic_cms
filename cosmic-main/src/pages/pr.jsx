import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

// Sample press releases data
const pressReleases = [
  {
    id: 1,
    title: "SS Tech Announces New Solar Panel Technology",
    date: "15 March 2025",
    image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt: "SS Tech unveils revolutionary solar panel technology with 30% higher efficiency than current market standards.",
  },
  {
    id: 2,
    title: "SS Tech Expands Operations to Three New States",
    date: "28 February 2025",
    image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt: "Company announces major expansion into Gujarat, Maharashtra, and Karnataka with new offices and installation teams.",
  },
  {
    id: 3,
    title: "SS Tech Partners with Government for Rural Solar Initiative",
    date: "10 January 2025",
    image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-05.jpg",
    excerpt: "New partnership aims to bring solar power to 500 villages across India within the next two years.",
  },
  {
    id: 4,
    title: "SS Tech Receives Industry Award for Sustainability",
    date: "05 December 2024",
    image: "https://zolar.wpengine.com/wp-content/uploads/2025/01/blog-01.jpg",
    excerpt: "Company recognized for its commitment to environmental sustainability and carbon-neutral operations.",
  },
];

// Press Release Card Component
function PressReleaseCard({ release }) {
  return (
    <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full sm:w-56 h-48 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={release.image}
          alt={release.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} strokeWidth={1.5} /> {release.date}
          </p>
          <h3 className="font-semibold text-lg text-gray-900">
            {release.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
            {release.excerpt}
          </p>
        </div>
        <Link
          to={`/pr/${release.id}`}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Read Full Release
        </Link>
      </div>
    </article>
  );
}

// Main PR Page Component
export default function PressReleasePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Press Releases</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-[#cae28e] transition-colors">Home</Link>
            <span>—</span>
            <Link to="/blog" className="hover:text-[#cae28e] transition-colors">Blog</Link>
            <span>—</span>
            <span className="text-[#cae28e]">Press Releases</span>
          </div>
        </div>
      </div>

      {/* Press Releases Section */}
      <section className="relative bg-[#f8faf9] py-20 overflow-hidden">
        {/* faint wavy pattern (optional) */}
        <div className="absolute inset-0 pointer-events-none select-none bg-[url('/img/pattern-waves.svg')] opacity-10" />

        <div className="relative z-[1] max-w-6xl mx-auto px-4 sm:px-5">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Company Announcements & News</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Stay updated with the latest announcements, partnerships, and milestones from SS Tech as we continue to innovate in the solar energy industry.
            </p>
          </div>
          
          {/* GRID */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {pressReleases.map((release) => (
              <PressReleaseCard key={release.id} release={release} />
            ))}
          </div>

          {/* Contact Press Team */}
          <div className="mt-16 p-8 bg-white rounded-xl shadow-sm text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Media Inquiries</h3>
            <p className="text-gray-600 mb-6">
              For press inquiries, interview requests, or additional information, please contact our media relations team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:press@sstech.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-[#cae28e] text-gray-900 font-medium rounded-full hover:bg-[#b8d07c] transition-colors"
              >
                Email Press Team
              </a>
              <a 
                href="tel:+919876543210" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                Call Media Relations
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}