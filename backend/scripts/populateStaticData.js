import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  Hero,
  AboutHero,
  AboutUs,
  WhoWeAre,
  OurExpertise,
  WhyChooseCosmic,
  VisionMissionValues,
  Testimonial,
  Team,
  ServiceHero,
  MainService,
  AdditionalService,
  ProcessStep,
  ServiceCTA,
  DirectorHero,
  Director,
  DirectorCTA,
  CompanyCultureHero,
  BrandVision,
  CoreValue,
  WorkEnvironment,
  JoinTeamCTA
} from '../models/index.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Hero Slides Data
const heroSlidesData = [
  {
    key: 'smart',
    num: '01',
    railTitle: 'What Is Cosmic\nPowertech',
    subtitle: 'Eco-Friendly Energy',
    title: ['Powering A Greener', 'Future With Solar'],
    body: 'Cosmic Powertech is a leading solar energy company dedicated to providing innovative and sustainable solar solutions across India. With a commitment to excellence and environmental responsibility.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-h1-slider-img-alt.jpg',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M34,62.1h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-6.9c0-0.4,0.3-0.7,0.7-0.7H34c0.4,0,0.7,0.3,0.7,0.7v6.9   C34.7,61.8,34.4,62.1,34,62.1z M27.9,60.7h5.4v-5.4h-5.4V60.7z"></path></g></svg>',
    order: 1,
    isActive: true,
    isFeatured: true
  },
  {
    key: 'advanced',
    num: '02',
    railTitle: 'Projects\nOverviews',
    subtitle: 'Intelligent Solution',
    title: ['Next-Gen Solar', 'For Your Home!'],
    body: 'We specialize in designing, installing, and maintaining solar power systems for residential, commercial, and industrial applications with cutting-edge technology.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/home1-1-01.jpg',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><path d="M50,10 L60,30 L80,30 L65,45 L70,65 L50,55 L30,65 L35,45 L20,30 L40,30 Z"></path></g></svg>',
    order: 2,
    isActive: true,
    isFeatured: true
  },
  {
    key: 'sustainable',
    num: '03',
    railTitle: 'Sustainable\nEnergy',
    subtitle: 'Clean Technology',
    title: ['Building Tomorrow\'s', 'Energy Today'],
    body: 'Join the renewable energy revolution with our comprehensive solar solutions that reduce carbon footprint and energy costs significantly.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-h1-slider-img-alt.jpg',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2"/></g></svg>',
    order: 3,
    isActive: true,
    isFeatured: true
  }
];

// About Hero Data
const aboutHeroData = {
  title: 'About',
  videoUrl: '/aboutvideo.mp4',
  breadcrumbHome: 'Home',
  breadcrumbCurrent: 'About',
  isActive: true
};

// About Us Data
const aboutUsData = {
  title: 'About Us :',
  description: 'Cosmic Powertech is a leading solar energy company dedicated to providing innovative and sustainable solar solutions across India. With a commitment to excellence and environmental responsibility, we specialize in designing, installing, and maintaining solar power systems for residential, commercial, and industrial applications.',
  additionalDescription: 'Specializing in a diverse portfolio that includes rooftop solar installations, ongrid and off-grid power plants, solar water heaters, and custom solutions for industries such as textiles, hospitality, pharmaceuticals, petroleum, FMCG, PACKAGING. Cosmic Powertech offers comprehensive services from initial consultation to installation and long-term maintenance. Their in-house team of skilled engineers and sales professionals ensure high-quality execution and unmatched responsiveness, positioning the company to meet the evolving demands of India\'s growing solar market.',
  isActive: true
};

// Who We Are Data
const whoWeAreData = {
  title: 'Who we are ?',
  description: 'Cosmic Powertech is a Surat-based solar energy company transforming the way India powers its future. Founded by Chaitanya and Charchil Shah, we specialize in end-to-end renewable energy solutions—rooftop systems, solar water heaters, and on/off-grid power plants. Our mission is simple: make clean energy accessible, affordable, and reliable for everyone.',
  isActive: true
};

// Our Expertise Data
const ourExpertiseData = {
  title: 'Our Expertise',
  description: 'We serve diverse industries with tailored solar solutions',
  industries: [
    { name: 'Textiles', image: '/images/industries/textiles.jpg' },
    { name: 'Hospitality', image: '/images/industries/hospitality.jpg' },
    { name: 'Pharmaceuticals', image: '/images/industries/pharma.jpg' },
    { name: 'IT', image: '/images/industries/it.jpg' },
    { name: 'Gems and Jewellery', image: '/images/industries/gems.jpg' },
    { name: 'FMCG', image: '/images/industries/fmcg.jpg' },
    { name: 'Packaging', image: '/images/industries/packaging.jpg' },
    { name: 'Petroleum', image: '/images/industries/petroleum.jpg' }
  ],
  isActive: true
};

// Why Choose Cosmic Data
const whyChooseCosmicData = {
  title: 'Why Choose',
  highlight: 'Cosmic',
  features: [
    {
      title: 'Nationwide Reach',
      description: 'Comprehensive coverage across India with local expertise.',
      icon: 'globe'
    },
    {
      title: 'Diverse Portfolio',
      description: 'Extensive experience across multiple industry sectors.',
      icon: 'portfolio'
    },
    {
      title: 'Expert Team',
      description: 'A workforce of 1,000+ professionals dedicated to your success.',
      icon: 'team'
    },
    {
      title: 'Customer Focus',
      description: 'Tailored solutions for every industry segment.',
      icon: 'customer'
    },
    {
      title: 'Quality Assurance',
      description: 'We never compromise on the quality of products and services we offer.',
      icon: 'quality'
    }
  ],
  isActive: true
};

// Vision Mission Values Data
const visionMissionValuesData = {
  vision: {
    title: 'Vision',
    description: 'Cosmic Powertech envisions a world where sustainable living is second nature, driven by the widespread adoption of clean, abundant renewable energy. We dedicate ourselves to crafting tailored solar solutions that precisely address the distinctive requirements of every household and business, fostering a future where environmental stewardship and economic prosperity go hand in hand.'
  },
  mission: {
    title: 'Mission',
    description: 'The dedication to achieve our vision is a reflected in our mission to make solar power accessible and affordable, thereby enabling individuals and businesses to participate actively in the global shift towards sustainability.'
  },
  values: {
    title: 'Value',
    description: 'At Cosmic Powertech, our values are rooted in sustainability, innovation, and people-first service. We are committed to making solar energy accessible and affordable, empowering individuals and businesses to join India\'s green revolution.'
  },
  isActive: true
};

// Service Hero Data
const serviceHeroData = {
  title: 'Services',
  subtitle: 'Solar-Powered Lighting Systems Projects',
  videoUrl: '/servicesvideo.mp4',
  breadcrumbHome: 'Home',
  breadcrumbCurrent: 'Services',
  isActive: true
};

// Main Services Data
const mainServicesData = [
  {
    title: 'Rooftop Solar Installation',
    description: 'Complete rooftop solar solutions for residential and commercial properties with high-efficiency panels and professional installation.',
    icon: 'solar-panel',
    features: ['High-efficiency panels', 'Professional installation', '25-year warranty', 'Monitoring system'],
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    title: 'On-Grid Solar Systems',
    description: 'Grid-tied solar systems that allow you to sell excess power back to the grid while reducing your electricity bills.',
    icon: 'grid',
    features: ['Grid connectivity', 'Net metering', 'Reduced bills', 'Eco-friendly'],
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    title: 'Off-Grid Solar Systems',
    description: 'Independent solar power systems with battery storage for areas without grid connectivity or backup power needs.',
    icon: 'battery',
    features: ['Battery storage', 'Independent power', 'Backup solution', 'Remote areas'],
    isActive: true,
    isFeatured: true,
    order: 3
  },
  {
    title: 'Solar Water Heaters',
    description: 'Energy-efficient solar water heating systems for residential and commercial applications.',
    icon: 'water-heater',
    features: ['Energy efficient', 'Cost effective', 'Eco-friendly', 'Low maintenance'],
    isActive: true,
    isFeatured: true,
    order: 4
  }
];

// Director Hero Data
const directorHeroData = {
  title: 'Director\'s Desk',
  subtitle: 'Leadership Vision',
  videoUrl: '/directordesk.mp4',
  breadcrumbHome: 'Home',
  breadcrumbCurrent: 'Director\'s Desk',
  isActive: true
};

// Directors Data
const directorsData = [
  {
    name: 'Chaitanya Shah',
    position: 'Co-Founder & Director',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    qualification: 'MBA (Operations), B.Tech',
    experience: '15+ years in Solar Energy',
    message: 'As the Co-Founder of Cosmic Powertech, I am committed to ensuring operational excellence across all our projects. My focus is on streamlining processes, optimizing resource allocation, and maintaining the highest standards of quality in every installation we undertake. We believe in making solar energy accessible and affordable for everyone.',
    vision: 'To establish industry-leading operational standards that make solar energy adoption seamless and efficient for all our clients.',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'FaLinkedin' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'FaTwitter' },
      { platform: 'Email', url: 'mailto:chaitanya@cosmicpowertech.com', icon: 'FaEnvelope' }
    ],
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    name: 'Charchil Shah',
    position: 'Co-Founder & Director',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    qualification: 'M.Sc (Quality Management), Six Sigma Black Belt',
    experience: '18+ years in Quality Assurance',
    message: 'Quality is not just a department at Cosmic Powertech; it\'s a philosophy that permeates every aspect of our operations. From the selection of premium components to the final installation, we ensure that every solar solution we deliver meets the highest international standards.',
    vision: 'To create the most efficient and adaptable production systems in the solar industry, capable of delivering customized solutions with consistent quality and reliability.',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'FaLinkedin' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'FaTwitter' },
      { platform: 'Email', url: 'mailto:charchil@cosmicpowertech.com', icon: 'FaEnvelope' }
    ],
    isActive: true,
    isFeatured: true,
    order: 2
  }
];

// Sample Testimonials Data
const testimonialsData = [
  {
    name: 'Rajesh Patel',
    position: 'Factory Owner',
    company: 'Patel Textiles',
    quote: 'Cosmic Powertech transformed our energy costs. The solar installation was seamless and the team was professional throughout the process.',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    rating: 5,
    projectType: 'Commercial',
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    name: 'Priya Sharma',
    position: 'Homeowner',
    company: 'Residential',
    quote: 'Our electricity bills have reduced by 80% after installing solar panels. Highly recommend Cosmic Powertech for their quality service.',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    rating: 5,
    projectType: 'Residential',
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    name: 'Dr. Amit Kumar',
    position: 'Hospital Administrator',
    company: 'Kumar Hospital',
    quote: 'The solar water heating system has been working flawlessly for 2 years. Great investment for our hospital.',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    rating: 5,
    projectType: 'Commercial',
    isActive: true,
    isFeatured: true,
    order: 3
  }
];

// Team Members Data
const teamMembersData = [
  {
    name: 'Chaitanya Shah',
    position: 'Co-Founder & Director',
    department: 'Leadership',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    bio: 'Visionary leader with 15+ years of experience in solar energy sector.',
    email: 'chaitanya@cosmicpowertech.com',
    phone: '+91 9876543210',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/chaitanya-shah',
      twitter: 'https://twitter.com/chaitanya_shah'
    },
    isActive: true,
    featured: true,
    order: 1
  },
  {
    name: 'Charchil Shah',
    position: 'Co-Founder & Director',
    department: 'Leadership',
    image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
    bio: 'Quality expert ensuring excellence in every solar installation.',
    email: 'charchil@cosmicpowertech.com',
    phone: '+91 9876543211',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/charchil-shah',
      twitter: 'https://twitter.com/charchil_shah'
    },
    isActive: true,
    featured: true,
    order: 2
  }
];

// Company Culture Hero Data
const companyCultureHeroData = {
  title: 'Company Culture',
  subtitle: 'Building Tomorrow Together',
  videoUrl: '/company-culture.mp4',
  breadcrumbHome: 'Home',
  breadcrumbCurrent: 'Company Culture',
  isActive: true
};

// Brand Vision Data
const brandVisionData = {
  title: 'Brand Vision & Strategy',
  highlightText: 'Innovation',
  description: 'At Cosmic Powertech, our brand vision is centered around innovation, sustainability, and customer-centricity. We strive to be the leading solar energy company that transforms how India powers its future.',
  ctaText: 'Join Our Mission',
  ctaLink: '/careers',
  isActive: true
};

// Core Values Data
const coreValuesData = [
  {
    title: 'Innovation',
    description: 'We continuously innovate to provide cutting-edge solar solutions.',
    icon: 'lightbulb',
    order: 1,
    isActive: true
  },
  {
    title: 'Sustainability',
    description: 'Environmental responsibility is at the core of everything we do.',
    icon: 'leaf',
    order: 2,
    isActive: true
  },
  {
    title: 'Quality',
    description: 'We never compromise on the quality of our products and services.',
    icon: 'star',
    order: 3,
    isActive: true
  },
  {
    title: 'Customer Focus',
    description: 'Our customers are at the heart of our business decisions.',
    icon: 'heart',
    order: 4,
    isActive: true
  }
];

// Work Environment Data
const workEnvironmentData = [
  {
    title: 'Collaborative Workspace',
    description: 'Open and collaborative environment that fosters creativity and innovation.',
    image: '/images/work-environment/collaborative.jpg',
    order: 1,
    isActive: true
  },
  {
    title: 'Learning & Development',
    description: 'Continuous learning opportunities and professional development programs.',
    image: '/images/work-environment/learning.jpg',
    order: 2,
    isActive: true
  },
  {
    title: 'Work-Life Balance',
    description: 'Flexible working arrangements and emphasis on work-life balance.',
    image: '/images/work-environment/balance.jpg',
    order: 3,
    isActive: true
  }
];

// Join Team CTA Data
const joinTeamCTAData = {
  title: 'Ready to Join Our Team?',
  description: 'Be part of India\'s renewable energy revolution. Join our team of passionate professionals.',
  ctaText: 'View Open Positions',
  ctaLink: '/careers',
  backgroundImage: '/images/join-team-bg.jpg',
  isActive: true
};

// Function to populate data
const populateData = async () => {
  try {
    console.log('Starting data population...');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Hero.deleteMany({}),
      AboutHero.deleteMany({}),
      AboutUs.deleteMany({}),
      WhoWeAre.deleteMany({}),
      OurExpertise.deleteMany({}),
      WhyChooseCosmic.deleteMany({}),
      VisionMissionValues.deleteMany({}),
      ServiceHero.deleteMany({}),
      MainService.deleteMany({}),
      DirectorHero.deleteMany({}),
      Director.deleteMany({}),
      Testimonial.deleteMany({}),
      Team.deleteMany({}),
      CompanyCultureHero.deleteMany({}),
      BrandVision.deleteMany({}),
      CoreValue.deleteMany({}),
      WorkEnvironment.deleteMany({}),
      JoinTeamCTA.deleteMany({})
    ]);

    // Populate Hero Slides
    console.log('Populating hero slides...');
    await Hero.insertMany(heroSlidesData);

    // Populate About sections
    console.log('Populating about sections...');
    await AboutHero.create(aboutHeroData);
    await AboutUs.create(aboutUsData);
    await WhoWeAre.create(whoWeAreData);
    await OurExpertise.create(ourExpertiseData);
    await WhyChooseCosmic.create(whyChooseCosmicData);
    await VisionMissionValues.create(visionMissionValuesData);

    // Populate Service sections
    console.log('Populating service sections...');
    await ServiceHero.create(serviceHeroData);
    await MainService.insertMany(mainServicesData);

    // Populate Director sections
    console.log('Populating director sections...');
    await DirectorHero.create(directorHeroData);
    await Director.insertMany(directorsData);

    // Populate Testimonials
    console.log('Populating testimonials...');
    await Testimonial.insertMany(testimonialsData);

    // Populate Team Members
    console.log('Populating team members...');
    await Team.insertMany(teamMembersData);

    // Populate Company Culture sections
    console.log('Populating company culture sections...');
    await CompanyCultureHero.create(companyCultureHeroData);
    await BrandVision.create(brandVisionData);
    await CoreValue.insertMany(coreValuesData);
    await WorkEnvironment.insertMany(workEnvironmentData);
    await JoinTeamCTA.create(joinTeamCTAData);

    console.log('✅ All static data populated successfully!');
    console.log('\n📊 Data Summary:');
    console.log(`- Hero Slides: ${heroSlidesData.length}`);
    console.log(`- About Sections: 6`);
    console.log(`- Service Sections: ${mainServicesData.length + 1}`);
    console.log(`- Director Sections: ${directorsData.length + 1}`);
    console.log(`- Testimonials: ${testimonialsData.length}`);
    console.log(`- Team Members: ${teamMembersData.length}`);
    console.log(`- Company Culture Sections: ${coreValuesData.length + workEnvironmentData.length + 2}`);

  } catch (error) {
    console.error('❌ Error populating data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the script
const runScript = async () => {
  console.log('🚀 Starting Cosmic CMS Data Population Script...');
  console.log('=' .repeat(50));
  
  await connectDB();
  await populateData();
  
  console.log('=' .repeat(50));
  console.log('✨ Script completed successfully!');
  process.exit(0);
};

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runScript().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export default runScript;