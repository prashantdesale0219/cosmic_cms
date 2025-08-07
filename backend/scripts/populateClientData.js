import mongoose from 'mongoose';
import Client from '../models/Client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleClients = [
  {
    name: "TechCorp Solutions",
    logo: "https://via.placeholder.com/200x100/0066cc/ffffff?text=TechCorp",
    description: "Leading technology solutions provider",
    website: "https://techcorp.com",
    industry: "Technology",
    order: 1,
    isActive: true
  },
  {
    name: "Green Energy Ltd",
    logo: "https://via.placeholder.com/200x100/00cc66/ffffff?text=GreenEnergy",
    description: "Renewable energy solutions company",
    website: "https://greenenergy.com",
    industry: "Energy",
    order: 2,
    isActive: true
  },
  {
    name: "Smart Manufacturing",
    logo: "https://via.placeholder.com/200x100/cc6600/ffffff?text=SmartMfg",
    description: "Industrial automation and smart manufacturing",
    website: "https://smartmfg.com",
    industry: "Manufacturing",
    order: 3,
    isActive: true
  },
  {
    name: "EcoBuilders",
    logo: "https://via.placeholder.com/200x100/66cc00/ffffff?text=EcoBuilders",
    description: "Sustainable construction and green building solutions",
    website: "https://ecobuilders.com",
    industry: "Construction",
    order: 4,
    isActive: true
  },
  {
    name: "Solar Innovations",
    logo: "https://via.placeholder.com/200x100/ffcc00/000000?text=SolarInno",
    description: "Advanced solar panel technology and installation",
    website: "https://solarinnovations.com",
    industry: "Solar Energy",
    order: 5,
    isActive: true
  },
  {
    name: "PowerGrid Systems",
    logo: "https://via.placeholder.com/200x100/cc0066/ffffff?text=PowerGrid",
    description: "Electrical grid management and power distribution",
    website: "https://powergridsystems.com",
    industry: "Utilities",
    order: 6,
    isActive: true
  }
];

async function populateClientData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmic-website-cms');
    console.log('Connected to MongoDB');

    // Clear existing clients
    await Client.deleteMany({});
    console.log('Cleared existing client data');

    // Insert sample clients
    const insertedClients = await Client.insertMany(sampleClients);
    console.log(`Successfully inserted ${insertedClients.length} clients:`);
    
    insertedClients.forEach((client, index) => {
      console.log(`${index + 1}. ${client.name} - ${client.industry}`);
    });

    console.log('\nClient data population completed successfully!');
    
  } catch (error) {
    console.error('Error populating client data:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
populateClientData();