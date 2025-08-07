import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Hero from '../models/Hero.js';
import EnergySolution from '../models/EnergySolution.js';
import Product from '../models/Product.js';
import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';
import Team from '../models/Team.js';
import BlogPost from '../models/BlogPost.js';
import Faq from '../models/Faq.js';
import Setting from '../models/Setting.js';
import { GreenFuture } from '../models/index.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const populateHomepageData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await Hero.deleteMany({});
    await EnergySolution.deleteMany({});
    await Product.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await Team.deleteMany({});
    await BlogPost.deleteMany({});
    await Faq.deleteMany({});
    await Setting.deleteMany({});
    await GreenFuture.deleteMany({});
    await User.deleteMany({});

    // Create a default user for blog posts
    const defaultUser = await User.create({
      username: 'admin',
      email: 'admin@cosmicsolar.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('Default user created:', defaultUser._id);

    // Create Hero Slides
    const heroSlides = [
      {
        key: 'hero-slide-1',
        num: '01',
        railTitle: 'Solar Energy',
        title: ['Solar Energy', 'Solutions'],
        subtitle: 'Powering Your Future with Clean Energy',
        body: 'Transform your home or business with our cutting-edge solar technology. Save money while saving the planet.',
        img: '/uploads/hero1.jpg',
        icon: '<svg>...</svg>',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        key: 'hero-slide-2',
        num: '02',
        railTitle: 'Green Future',
        title: ['Sustainable', 'Tomorrow'],
        subtitle: 'Leading the Green Revolution',
        body: 'Join thousands of satisfied customers who have made the switch to renewable energy.',
        img: '/uploads/hero2.jpg',
        icon: '<svg>...</svg>',
        isActive: true,
        isFeatured: true,
        order: 2
      }
    ];

    await Hero.insertMany(heroSlides);
    console.log('Hero slides created');

    // Create Energy Solutions
    const energySolutions = [
      {
        title: 'Residential Solar',
        slug: 'residential-solar',
        description: 'Complete solar solutions for homes',
        icon: 'home',
        img: '/uploads/residential-solar.jpg',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        title: 'Commercial Solar',
        slug: 'commercial-solar',
        description: 'Large-scale solar installations for businesses',
        icon: 'building',
        img: '/uploads/commercial-solar.jpg',
        isActive: true,
        isFeatured: true,
        order: 2
      },
      {
        title: 'Industrial Solar',
        slug: 'industrial-solar',
        description: 'High-capacity solar systems for industries',
        icon: 'factory',
        img: '/uploads/industrial-solar.jpg',
        isActive: true,
        isFeatured: true,
        order: 3
      }
    ];

    await EnergySolution.insertMany(energySolutions);
    console.log('Energy solutions created');

    // Create Products
    const products = [
      {
        title: 'Solar Panel 300W',
        slug: 'solar-panel-300w',
        oldPrice: '₹25,000',
        newPrice: '₹20,000',
        category: 'solar-panels',
        description: 'High-efficiency monocrystalline solar panel',
        image: '/uploads/solar-panel-300w.jpg',
        hoverImage: '/uploads/solar-panel-300w-hover.jpg',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        title: 'Solar Inverter 5KW',
        slug: 'solar-inverter-5kw',
        oldPrice: '₹45,000',
        newPrice: '₹40,000',
        category: 'inverters',
        description: 'Pure sine wave solar inverter',
        image: '/uploads/solar-inverter-5kw.jpg',
        hoverImage: '/uploads/solar-inverter-5kw-hover.jpg',
        isActive: true,
        isFeatured: true,
        order: 2
      }
    ];

    await Product.insertMany(products);
    console.log('Products created');

    // Create Projects
    const projects = [
      {
        title: 'Residential Solar Installation - Mumbai',
        slug: 'residential-solar-mumbai',
        client: 'Mr. Sharma',
        location: 'Mumbai, Maharashtra',
        completionDate: new Date('2023-12-01'),
        description: '5KW rooftop solar installation for residential property',
        category: 'Residential',
        coverImage: '/uploads/project-mumbai.jpg',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        title: 'Commercial Solar Project - Delhi',
        slug: 'commercial-solar-delhi',
        client: 'ABC Industries',
        location: 'Delhi, India',
        completionDate: new Date('2023-11-15'),
        description: '100KW commercial solar installation for industrial facility',
        category: 'Commercial',
        coverImage: '/uploads/project-delhi.jpg',
        isActive: true,
        isFeatured: true,
        order: 2
      }
    ];

    await Project.insertMany(projects);
    console.log('Projects created');

    // Create Testimonials
    const testimonials = [
      {
        name: 'Rajesh Kumar',
        designation: 'Homeowner',
        company: 'Mumbai',
        message: 'Excellent service and quality products. Our electricity bills have reduced by 80%.',
        quote: 'Cosmic Solar provided excellent service and quality solar panels. Our electricity bills have reduced by 80% since installation.',
        rating: 5,
        image: '/uploads/testimonial1.jpg',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        name: 'Priya Sharma',
        designation: 'Business Owner',
        company: 'Delhi',
        message: 'Professional installation and great customer support. Highly recommended!',
        quote: 'Professional installation team and great after-sales support. Highly recommend Cosmic Solar for commercial solar solutions.',
        rating: 5,
        image: '/uploads/testimonial2.jpg',
        isActive: true,
        isFeatured: true,
        order: 2
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials created');

    // Create Team Members
    const teamMembers = [
      {
        name: 'John Doe',
        position: 'CEO & Founder',
        bio: 'Leading the solar revolution with 15+ years of experience',
        image: '/uploads/team-john-doe.jpg',
        isActive: true,
        featured: true,
        order: 1
      },
      {
        name: 'Jane Smith',
        position: 'CTO',
        bio: 'Technology expert specializing in renewable energy systems',
        image: '/uploads/team-jane-smith.jpg',
        isActive: true,
        featured: true,
        order: 2
      }
    ];

    await Team.insertMany(teamMembers);
    console.log('Team members created');

    // Create Blog Posts
    const blogPosts = [
      {
        title: 'Benefits of Solar Energy',
        slug: 'benefits-of-solar-energy',
        excerpt: 'Discover the amazing benefits of switching to solar energy',
        content: 'Solar energy offers numerous benefits including cost savings, environmental protection, and energy independence...',
        image: '/uploads/blog-solar-benefits.jpg',
        author: defaultUser._id,
        isActive: true,
        isFeatured: true,
        publishedAt: new Date()
      },
      {
        title: 'Solar Panel Maintenance Tips',
        slug: 'solar-panel-maintenance-tips',
        excerpt: 'Keep your solar panels running efficiently with these tips',
        content: 'Regular maintenance is crucial for optimal solar panel performance...',
        image: '/uploads/blog-maintenance-tips.jpg',
        author: defaultUser._id,
        isActive: true,
        isFeatured: true,
        publishedAt: new Date()
      }
    ];

    await BlogPost.insertMany(blogPosts);
    console.log('Blog posts created');

    // Create FAQs
    const faqs = [
      {
        question: 'How much can I save with solar?',
        answer: 'Most customers save 70-90% on their electricity bills with our solar solutions.',
        isActive: true,
        order: 1
      },
      {
        question: 'What is the warranty on solar panels?',
        answer: 'We provide 25 years warranty on solar panels and 5 years on inverters.',
        isActive: true,
        order: 2
      },
      {
        question: 'How long does installation take?',
        answer: 'Typical residential installation takes 1-2 days, while commercial projects may take 1-2 weeks.',
        isActive: true,
        order: 3
      }
    ];

    await Faq.insertMany(faqs);
    console.log('FAQs created');

    // Create Settings
    const settings = {
      siteTitle: 'Cosmic Solar',
      tagline: 'Powering Your Future with Clean Energy',
      logo: '/uploads/cosmic-logo.png',
      contactEmail: 'info@cosmicsolar.com',
      contactPhone: '+91 9876543210',
      address: '123 Solar Street, Green City, India',
      socialMedia: {
        facebook: 'https://facebook.com/cosmic-solar',
        twitter: 'https://twitter.com/cosmic-solar',
        instagram: 'https://instagram.com/cosmic-solar',
        linkedin: 'https://linkedin.com/company/cosmic-solar'
      }
    };

    await Setting.create(settings);
    console.log('Settings created');

    // Create Green Future
    const greenFuture = {
      title: 'ENABLING A GREEN FUTURE',
      description: 'Creating climate for change through thought leadership and raising awareness towards solar industry',
      isActive: true,
      newsCards: [
        {
          title: 'Solar Energy Breakthrough',
          image: '/uploads/news-solar-breakthrough.jpg',
          date: '2024-01-15',
          excerpt: 'Latest innovations in solar technology',
          content: 'Recent developments in solar panel efficiency have revolutionized the renewable energy sector...',
          order: 1
        }
      ]
    };

    await GreenFuture.create(greenFuture);
    console.log('Green Future data created');

    console.log('\n✅ Homepage data populated successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error populating homepage data:', error);
    process.exit(1);
  }
};

populateHomepageData();