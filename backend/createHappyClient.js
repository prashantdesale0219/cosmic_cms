import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { HappyClient } from './models/index.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample happy client data
const happyClientData = {
  title: 'Our Happy Clients',
  subtitle: 'Trusted by Industry Leaders',
  description: 'We have successfully delivered solar solutions to numerous clients across various industries.',
  backgroundVideo: '/uploads/videos/background.mp4',
  companyVideo: '/uploads/videos/company.mp4',
  stats: [
    {
      value: 500,
      label: 'Happy Clients',
      icon: 'FaUsers',
      color: '#9fc22f',
      suffix: '+',
      description: 'Satisfied customers across India',
      order: 1
    },
    {
      value: 1000,
      label: 'Projects Completed',
      icon: 'FaProjectDiagram',
      color: '#3498db',
      suffix: '+',
      description: 'Successfully delivered projects',
      order: 2
    },
    {
      value: 50,
      label: 'MW Installed',
      icon: 'FaSolarPanel',
      color: '#e74c3c',
      suffix: '+',
      description: 'Total solar capacity installed',
      order: 3
    },
    {
      value: 75000,
      label: 'CO2 Reduction',
      icon: 'FaBolt',
      color: '#2ecc71',
      suffix: 'T',
      description: 'Tons of CO2 emissions reduced',
      order: 4
    }
  ],
  ctaText: 'Learn More About Us',
  ctaLink: '/about',
  isActive: true
};

// Create happy client record
const createHappyClient = async () => {
  try {
    // Check if a happy client record already exists
    const existingHappyClient = await HappyClient.findOne();
    
    if (existingHappyClient) {
      console.log('Happy client record already exists:', existingHappyClient);
      process.exit(0);
    }
    
    // Create new happy client record
    const newHappyClient = await HappyClient.create(happyClientData);
    console.log('Happy client record created successfully:', newHappyClient);
    process.exit(0);
  } catch (error) {
    console.error('Error creating happy client record:', error);
    process.exit(1);
  }
};

// Run the function
createHappyClient();