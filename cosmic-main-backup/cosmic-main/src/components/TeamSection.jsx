import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaXTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa6";

/* ------------ data ------------ */
const members = [
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg",
    name: "Mark Antony",
    role: "Operations Manager",
  },
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img2.jpg",
    name: "Stella katrel",
    role: "Solar Engineer",
  },
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img3.jpg",
    name: "Benjamin ells",
    role: "Chief Technology Officer",
  },
  {
    img: "https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img3.jpg",
    name: "Jenifer Thomas",
    role: "Installation Specialist",
  },
];

/* social icons */
const socials = [
  { icon: FaFacebookF, href: "#" },
  { icon: FaXTwitter, href: "#" },
  { icon: FaYoutube, href: "#" },
  { icon: FaLinkedinIn, href: "#" },
];

const TeamSection = () => (
  <section
    className="relative bg-white"
    style={{
      backgroundImage:
        "url('https://zolar.wpengine.com/wp-content/uploads/2024/11/hero-bg-pattern.svg')",
      backgroundSize: "cover",
    }}
  >
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
      {/* heading */}
      <header className="text-center mb-20">
        <p className="font-semibold uppercase tracking-wider text-gray-700 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
          Our Team
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold">Meet Our Experts</h2>
      </header>

      {/* cards */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {members.map(({ img, name, role }) => (
          <article
            key={name}
            className="group bg-[#F2F8F5] rounded-xl overflow-hidden shadow"
          >
            {/* portrait + overlay */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* image with grayscale on hover */}
              <img
                src={img}
                alt={name}
                className="w-full h-full object-cover transition duration-500 group-hover:grayscale"
              />

              {/* sliding black gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10
                           translate-y-full group-hover:translate-y-0
                           transition-transform duration-500 ease-out pointer-events-none"
              />
            </div>

            {/* details */}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                <p className="text-gray-600 mt-1">{role}</p>
              </div>

              <hr className="border-gray-200" />

              {/* socials */}
              <ul className="flex gap-6">
                {socials.map(({ icon: Icon, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-gray-900 hover:text-[#b4dc6b] transition"
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
