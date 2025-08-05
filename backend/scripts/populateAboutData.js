import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AboutHero from '../models/AboutHero.js';
import AboutUs from '../models/AboutUs.js';
import WhoWeAre from '../models/WhoWeAre.js';
import OurExpertise from '../models/OurExpertise.js';
import WhyChooseCosmic from '../models/WhyChooseCosmic.js';
import VisionMissionValues from '../models/VisionMissionValues.js';
import aboutData from '../utils/extractAboutData.js';

// Load environment variables
dotenv.config();

const populateAboutData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      AboutHero.deleteMany({}),
      AboutUs.deleteMany({}),
      WhoWeAre.deleteMany({}),
      OurExpertise.deleteMany({}),
      WhyChooseCosmic.deleteMany({}),
      VisionMissionValues.deleteMany({})
    ]);
    
    console.log('Cleared existing data');

    // Create new data
    const aboutHero = await AboutHero.create(aboutData.aboutHero);
    console.log('Created About Hero:', aboutHero._id);

    const aboutUs = await AboutUs.create(aboutData.aboutUs);
    console.log('Created About Us:', aboutUs._id);

    const whoWeAre = await WhoWeAre.create(aboutData.whoWeAre);
    console.log('Created Who We Are:', whoWeAre._id);

    const ourExpertise = await OurExpertise.create(aboutData.ourExpertise);
    console.log('Created Our Expertise:', ourExpertise._id);

    const whyChooseCosmic = await WhyChooseCosmic.create(aboutData.whyChooseCosmic);
    console.log('Created Why Choose Cosmic:', whyChooseCosmic._id);

    const visionMissionValues = await VisionMissionValues.create(aboutData.visionMissionValues);
    console.log('Created Vision Mission Values:', visionMissionValues._id);

    console.log('\n✅ All About data populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`- About Hero: ${aboutHero._id}`);
    console.log(`- About Us: ${aboutUs._id}`);
    console.log(`- Who We Are: ${whoWeAre._id}`);
    console.log(`- Our Expertise: ${ourExpertise._id} (${ourExpertise.industries.length} industries)`);
    console.log(`- Why Choose Cosmic: ${whyChooseCosmic._id} (${whyChooseCosmic.features.length} features)`);
    console.log(`- Vision Mission Values: ${visionMissionValues._id}`);

  } catch (error) {
    console.error('Error populating about data:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run the script
populateAboutData();