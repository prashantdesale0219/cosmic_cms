// Extract static data from about.jsx and create database entries

const aboutData = {
  aboutHero: {
    title: "About",
    videoUrl: "/aboutvideo.mp4",
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" }
    ],
    isActive: true
  },

  aboutUs: {
    title: "About Us :",
    description: "Cosmic Powertech is a leading solar energy company dedicated to providing innovative and sustainable solar solutions across India. With a commitment to excellence and environmental responsibility, we specialize in designing, installing, and maintaining solar power systems for residential, commercial, and industrial clients.",
    additionalDescription: "Our team of experienced professionals works tirelessly to deliver customized solar solutions that meet the unique energy needs of our clients while contributing to a greener future. We believe in harnessing the power of the sun to create a sustainable tomorrow.",
    isActive: true
  },

  whoWeAre: {
    title: "Who we are?",
    description: "We are a team of passionate professionals committed to revolutionizing the energy sector through innovative solar solutions. Our expertise spans across various industries, and we take pride in our ability to deliver tailored solutions that exceed expectations.",
    features: [
      "Expert team of solar professionals",
      "Nationwide service coverage",
      "Customized solutions for every need",
      "Commitment to sustainability"
    ],
    isActive: true
  },

  ourExpertise: {
    title: "Our Expertise",
    description: "We serve diverse industries with specialized solar solutions",
    industries: [
      {
        name: "Textiles",
        image: "/images/industries/textiles.jpg",
        description: "Sustainable energy solutions for textile manufacturing"
      },
      {
        name: "Paper Packaging",
        image: "/images/industries/paper.jpg",
        description: "Eco-friendly power for packaging industries"
      },
      {
        name: "Hospital",
        image: "/images/industries/hospital.jpg",
        description: "Reliable solar power for healthcare facilities"
      },
      {
        name: "Automobile",
        image: "/images/industries/automobile.jpg",
        description: "Clean energy solutions for automotive sector"
      },
      {
        name: "Oil and Gas",
        image: "/images/industries/oil-gas.jpg",
        description: "Solar solutions for energy sector operations"
      },
      {
        name: "Mining",
        image: "/images/industries/mining.jpg",
        description: "Sustainable power for mining operations"
      },
      {
        name: "Tourism",
        image: "/images/industries/tourism.jpg",
        description: "Green energy for hospitality and tourism"
      },
      {
        name: "Private and Government Sector",
        image: "/images/industries/government.jpg",
        description: "Solar solutions for public and private institutions"
      },
      {
        name: "Pharmaceuticals",
        image: "/images/industries/pharma.jpg",
        description: "Clean energy for pharmaceutical manufacturing"
      },
      {
        name: "IT",
        image: "/images/industries/it.jpg",
        description: "Sustainable power for technology companies"
      },
      {
        name: "Gems and Jewellery",
        image: "/images/industries/gems.jpg",
        description: "Solar solutions for jewelry manufacturing"
      }
    ],
    isActive: true
  },

  whyChooseCosmic: {
    title: "Why Choose Cosmic?",
    description: "We stand out in the solar industry with our commitment to excellence",
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
    ],
    isActive: true
  },

  visionMissionValues: {
    vision: {
      title: "Vision",
      description: "Cosmic Powertech envisions a world where sustainable living is second nature, driven by the widespread adoption of clean, abundant renewable energy. We dedicate ourselves to crafting tailored solar solutions that precisely address the distinctive requirements of every household, business, and industry we serve, while simultaneously advancing a healthier planet. Our pledge reaches far beyond routine operations; it infuses each consultation, installation, and maintenance visit with purpose, ensuring measurable, long-term impact. Guided by an unwavering belief in a future powered exclusively by renewable resources, we continually innovate, educate, and collaborate to accelerate India's transition toward carbon-free prosperity and global clean-energy leadership."
    },
    mission: {
      title: "Mission",
      description: "The dedication to achieve our vision is a reflected in our mission to make solar power accessible and affordable, thereby enabling individuals and businesses to participate actively in the global shift towards sustainability. By integrating advanced technology with personalized service, we aim to empower communities to harness solar energy effectively, reducing reliance on fossil fuels and promoting environmental stewardship. Our efforts are aligned with broader initiatives to mitigate climate change and support India's green energy goals, including the ambitious target of achieving 500 GW of renewable energy capacity by 2030. Through our unwavering focus on quality, innovation, and customer satisfaction, Cosmic Powertech aspires to be a leading force in the renewable energy, driving positive change and contributing to a sustainable future for all."
    },
    values: {
      title: "Value",
      description: "At Cosmic Powertech, our values are rooted in sustainability, innovation, and people-first service. We are committed to making solar energy accessible and affordable, empowering individuals and businesses to join India's green revolution. By integrating advanced technology with customized solutions, we help reduce dependence on fossil fuels and contribute to the nation's goal of 500 GW renewable energy by 2030. Every project reflects our dedication to climate action, engineering excellence, and long-term reliability. With a team driven by integrity and purpose, we deliver clean energy solutions that not only power homes and industries but also inspire a sustainable, greener future."
    },
    isActive: true
  }
};

export default aboutData;