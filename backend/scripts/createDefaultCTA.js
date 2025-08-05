import mongoose from 'mongoose';
import DirectorCTA from '../models/DirectorCta.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createDefaultCTA = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if CTA already exists
    const existingCTA = await DirectorCTA.findOne();
    if (existingCTA) {
      console.log('CTA already exists:', existingCTA);
      process.exit(0);
    }

    // Create default CTA
    const defaultCTA = new DirectorCTA({
      title: 'Join Us in Our Solar Mission',
      description: 'Whether you\'re looking to power your home, business, or join our team, we invite you to be part of our journey towards a sustainable future.',
      primaryButton: {
        text: 'Contact Us',
        url: '/contact'
      },
      secondaryButton: {
        text: 'Join Our Team',
        url: '/careers'
      },
      backgroundColor: 'bg-primary-600',
      isActive: true
    });

    await defaultCTA.save();
    console.log('Default CTA created successfully:', defaultCTA);

  } catch (error) {
    console.error('Error creating default CTA:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

createDefaultCTA();