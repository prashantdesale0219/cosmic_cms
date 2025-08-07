import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { HappyClient, SolarSolution, Timeline, Client } from './models/index.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosmic-website-cms';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data for Happy Clients
const happyClientsData = [
  {
    title: "Our Happy Clients",
    subtitle: "Trusted by thousands of customers worldwide",
    description: "We take pride in delivering exceptional solar solutions that exceed our clients' expectations. Our commitment to quality and customer satisfaction has earned us the trust of homeowners and businesses across the globe.",
    backgroundVideo: "/videos/happy-clients-bg.mp4",
    companyVideo: "/videos/company-overview.mp4",
    stats: [
      {
        value: 5000,
        label: "Happy Customers",
        icon: "FaUsers",
        color: "#9fc22f",
        suffix: "+",
        description: "Satisfied customers worldwide",
        order: 1
      },
      {
        value: 1200,
        label: "Projects Completed",
        icon: "FaProjectDiagram",
        color: "#2196F3",
        suffix: "+",
        description: "Successful solar installations",
        order: 2
      },
      {
        value: 25000,
        label: "Solar Panels Installed",
        icon: "FaSolarPanel",
        color: "#FF9800",
        suffix: "+",
        description: "High-quality solar panels",
        order: 3
      },
      {
        value: 15,
        label: "Years of Experience",
        icon: "FaBolt",
        color: "#4CAF50",
        suffix: "+",
        description: "Industry expertise",
        order: 4
      }
    ],
    ctaText: "Learn More About Us",
    ctaLink: "/about",
    isActive: true
  }
];

// Sample data for Solar Solutions
const solarSolutionsData = [
  {
    title: "Residential Solar Solutions",
    description: "Complete solar power solutions for homes with high-efficiency panels and smart inverters.",
    slug: "residential-solar-solutions",
    image: "/images/residential-solar.jpg",
    category: "Residential",
    features: [
      "High-efficiency solar panels",
      "Smart inverters",
      "Battery storage options",
      "Grid-tie capability",
      "25-year warranty"
    ],
    specifications: {
      capacity: "1kW to 10kW",
      efficiency: "20-22%",
      warranty: "25 years",
      installation: "1-2 days"
    },
    price: {
      starting: 50000,
      currency: "INR",
      unit: "per kW"
    },
    isFeatured: true,
    isActive: true,
    order: 1
  },
  {
    title: "Commercial Solar Solutions",
    description: "Scalable solar power systems for businesses and commercial establishments.",
    slug: "commercial-solar-solutions",
    image: "/images/commercial-solar.jpg",
    category: "Commercial",
    features: [
      "Scalable design",
      "Industrial-grade components",
      "Remote monitoring",
      "Energy management system",
      "ROI tracking"
    ],
    specifications: {
      capacity: "10kW to 1MW",
      efficiency: "21-23%",
      warranty: "25 years",
      installation: "3-7 days"
    },
    price: {
      starting: 45000,
      currency: "INR",
      unit: "per kW"
    },
    isFeatured: true,
    isActive: true,
    order: 2
  },
  {
    title: "Industrial Solar Solutions",
    description: "Large-scale solar installations for industrial facilities and manufacturing units.",
    slug: "industrial-solar-solutions",
    image: "/images/industrial-solar.jpg",
    category: "Industrial",
    features: [
      "Mega-scale installations",
      "Advanced monitoring",
      "Load balancing",
      "Grid stability",
      "Maintenance support"
    ],
    specifications: {
      capacity: "1MW to 100MW",
      efficiency: "22-24%",
      warranty: "25 years",
      installation: "1-4 weeks"
    },
    price: {
      starting: 40000,
      currency: "INR",
      unit: "per kW"
    },
    isFeatured: false,
    isActive: true,
    order: 3
  }
];

// Sample data for Timeline
const timelineData = [
  {
    year: 2015,
    title: "Company Founded",
    description: "Cosmic Solar was established with a vision to provide clean and sustainable energy solutions.",
    image: "/images/timeline/2015-founding.jpg",
    backgroundImage: "/images/timeline/2015-founding.jpg",
    achievements: [
      "Registered as a renewable energy company",
      "Assembled core team of engineers",
      "Established first office in Mumbai"
    ],
    isActive: true,
    order: 1
  },
  {
    year: 2016,
    title: "First Major Project",
    description: "Successfully completed our first 100kW commercial solar installation.",
    image: "/images/timeline/2016-first-project.jpg",
    backgroundImage: "/images/timeline/2016-first-project.jpg",
    achievements: [
      "Completed 100kW commercial installation",
      "Achieved 99.5% system efficiency",
      "Received first customer testimonial"
    ],
    isActive: true,
    order: 2
  },
  {
    year: 2018,
    title: "Expansion Phase",
    description: "Expanded operations to 5 major cities across India.",
    image: "/images/timeline/2018-expansion.jpg",
    backgroundImage: "/images/timeline/2018-expansion.jpg",
    achievements: [
      "Opened offices in Delhi, Bangalore, Chennai, Pune",
      "Completed 50+ residential projects",
      "Achieved 10MW total installation capacity"
    ],
    isActive: true,
    order: 3
  },
  {
    year: 2020,
    title: "Technology Innovation",
    description: "Launched smart solar solutions with IoT integration and remote monitoring.",
    image: "/images/timeline/2020-innovation.jpg",
    backgroundImage: "/images/timeline/2020-innovation.jpg",
    achievements: [
      "Developed proprietary monitoring system",
      "Launched mobile app for customers",
      "Achieved ISO 9001:2015 certification"
    ],
    isActive: true,
    order: 4
  },
  {
    year: 2022,
    title: "Sustainable Growth",
    description: "Reached 100MW total installation capacity and 1000+ satisfied customers.",
    image: "/images/timeline/2022-growth.jpg",
    backgroundImage: "/images/timeline/2022-growth.jpg",
    achievements: [
      "Completed 100MW installations",
      "Served 1000+ customers",
      "Received 'Best Solar Company' award"
    ],
    isActive: true,
    order: 5
  },
  {
    year: 2024,
    title: "Future Vision",
    description: "Leading the transition to renewable energy with advanced solar technologies.",
    image: "/images/timeline/2024-future.jpg",
    backgroundImage: "/images/timeline/2024-future.jpg",
    achievements: [
      "Launched energy storage solutions",
      "Expanded to 20+ cities",
      "Committed to 1GW capacity by 2030"
    ],
    isActive: true,
    order: 6
  }
];

// Sample data for Clients
const clientsData = [
  {
    name: "Tech Solutions Pvt Ltd",
    logo: "/images/clients/tech-solutions.png",
    website: "https://techsolutions.com",
    industry: "Technology",
    projectType: "Commercial Solar",
    capacity: "500kW",
    location: "Mumbai, Maharashtra",
    completionDate: new Date('2023-06-15'),
    testimonial: "Excellent service and professional installation. Our energy costs have reduced by 70%.",
    contactPerson: {
      name: "Rajesh Kumar",
      designation: "Facilities Manager",
      email: "rajesh@techsolutions.com",
      phone: "+91 9876543210"
    },
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    name: "Green Manufacturing Co",
    logo: "/images/clients/green-manufacturing.png",
    website: "https://greenmanufacturing.com",
    industry: "Manufacturing",
    projectType: "Industrial Solar",
    capacity: "2MW",
    location: "Pune, Maharashtra",
    completionDate: new Date('2023-08-20'),
    testimonial: "Outstanding project execution and excellent after-sales support.",
    contactPerson: {
      name: "Priya Sharma",
      designation: "Plant Manager",
      email: "priya@greenmanufacturing.com",
      phone: "+91 9876543211"
    },
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    name: "Residential Complex ABC",
    logo: "/images/clients/residential-abc.png",
    website: "https://residentialabc.com",
    industry: "Real Estate",
    projectType: "Residential Solar",
    capacity: "100kW",
    location: "Bangalore, Karnataka",
    completionDate: new Date('2023-09-10'),
    testimonial: "Great experience with Cosmic Solar. Professional team and quality installation.",
    contactPerson: {
      name: "Amit Patel",
      designation: "Society Chairman",
      email: "amit@residentialabc.com",
      phone: "+91 9876543212"
    },
    isActive: true,
    isFeatured: false,
    order: 3
  },
  {
    name: "Retail Chain XYZ",
    logo: "/images/clients/retail-xyz.png",
    website: "https://retailxyz.com",
    industry: "Retail",
    projectType: "Commercial Solar",
    capacity: "750kW",
    location: "Delhi, NCR",
    completionDate: new Date('2023-10-05'),
    testimonial: "Reliable solar solutions that have significantly reduced our operational costs.",
    contactPerson: {
      name: "Sunita Gupta",
      designation: "Operations Head",
      email: "sunita@retailxyz.com",
      phone: "+91 9876543213"
    },
    isActive: true,
    isFeatured: true,
    order: 4
  },
  {
    name: "Educational Institute DEF",
    logo: "/images/clients/institute-def.png",
    website: "https://institutedef.edu",
    industry: "Education",
    projectType: "Institutional Solar",
    capacity: "300kW",
    location: "Chennai, Tamil Nadu",
    completionDate: new Date('2023-11-12'),
    testimonial: "Cosmic Solar helped us achieve our sustainability goals with their efficient solar solutions.",
    contactPerson: {
      name: "Dr. Venkat Rao",
      designation: "Principal",
      email: "venkat@institutedef.edu",
      phone: "+91 9876543214"
    },
    isActive: true,
    isFeatured: false,
    order: 5
  }
];

const populateMissingData = async () => {
  try {
    await connectDB();
    
    console.log('Starting to populate missing data...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await HappyClient.deleteMany({});
    await SolarSolution.deleteMany({});
    await Timeline.deleteMany({});
    await Client.deleteMany({});
    
    // Populate Happy Clients
    console.log('Populating Happy Clients...');
    for (const happyClientData of happyClientsData) {
      const happyClient = new HappyClient(happyClientData);
      await happyClient.save();
      console.log(`Created Happy Client: ${happyClient.title}`);
    }
    
    // Populate Solar Solutions
    console.log('Populating Solar Solutions...');
    for (const solarSolutionData of solarSolutionsData) {
      const solarSolution = new SolarSolution(solarSolutionData);
      await solarSolution.save();
      console.log(`Created Solar Solution: ${solarSolution.title}`);
    }
    
    // Populate Timeline
    console.log('Populating Timeline...');
    for (const timelineItemData of timelineData) {
      const timelineItem = new Timeline(timelineItemData);
      await timelineItem.save();
      console.log(`Created Timeline Item: ${timelineItem.year} - ${timelineItem.title}`);
    }
    
    // Populate Clients
    console.log('Populating Clients...');
    for (const clientData of clientsData) {
      const client = new Client(clientData);
      await client.save();
      console.log(`Created Client: ${client.name}`);
    }
    
    console.log('\n✅ All missing data populated successfully!');
    console.log('\nSummary:');
    console.log(`- Happy Clients: ${happyClientsData.length} items`);
    console.log(`- Solar Solutions: ${solarSolutionsData.length} items`);
    console.log(`- Timeline Items: ${timelineData.length} items`);
    console.log(`- Clients: ${clientsData.length} items`);
    
  } catch (error) {
    console.error('Error populating missing data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

populateMissingData();