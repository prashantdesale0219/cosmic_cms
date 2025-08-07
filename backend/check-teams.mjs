import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from './models/Team.js';

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  const teams = await Team.find({});
  console.log('Teams found:', teams.length);
  console.log('Team data:', JSON.stringify(teams, null, 2));
  
  // If no teams found, let's create some sample data
  if (teams.length === 0) {
    console.log('No teams found. Creating sample team members...');
    
    const sampleTeams = [
      {
        name: 'John Doe',
        position: 'CEO & Founder',
        bio: 'Visionary leader with 15+ years of experience in renewable energy.',
        image: 'https://via.placeholder.com/300x300',
        email: 'john@cosmicenergy.com',
        phone: '+1-555-0101',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/johndoe'
        },
        department: 'Executive',
        skills: ['Leadership', 'Strategy', 'Renewable Energy'],
        featured: true,
        order: 1,
        isActive: true
      },
      {
        name: 'Jane Smith',
        position: 'CTO',
        bio: 'Technology expert specializing in solar energy systems.',
        image: 'https://via.placeholder.com/300x300',
        email: 'jane@cosmicenergy.com',
        phone: '+1-555-0102',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/janesmith'
        },
        department: 'Technology',
        skills: ['Solar Technology', 'Engineering', 'Innovation'],
        featured: true,
        order: 2,
        isActive: true
      },
      {
        name: 'Mike Johnson',
        position: 'Head of Operations',
        bio: 'Operations specialist ensuring smooth project delivery.',
        image: 'https://via.placeholder.com/300x300',
        email: 'mike@cosmicenergy.com',
        phone: '+1-555-0103',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/mikejohnson'
        },
        department: 'Operations',
        skills: ['Project Management', 'Operations', 'Team Leadership'],
        featured: false,
        order: 3,
        isActive: true
      }
    ];
    
    await Team.insertMany(sampleTeams);
    console.log('Sample team members created successfully!');
    
    const newTeams = await Team.find({});
    console.log('Updated teams count:', newTeams.length);
  }
  
} catch (error) {
  console.error('Error:', error);
} finally {
  await mongoose.disconnect();
  process.exit();
}