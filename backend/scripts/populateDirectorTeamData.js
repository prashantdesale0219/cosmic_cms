import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DirectorHero from '../models/DirectorHero.js';
import Director from '../models/Director.js';
import DirectorCTA from '../models/DirectorCta.js';
import Team from '../models/Team.js';

// Load environment variables
dotenv.config();

const populateDirectorTeamData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      DirectorHero.deleteMany({}),
      Director.deleteMany({}),
      DirectorCTA.deleteMany({}),
      Team.deleteMany({})
    ]);
    
    console.log('Cleared existing data');

    // Director Hero Data
    const directorHeroData = {
      title: "Director's Desk",
      subtitle: 'Meet Our Leadership Team',
      videoUrl: '/directordesk.mp4',
      breadcrumbHome: 'Home',
      breadcrumbCurrent: "Director's Desk",
      isActive: true
    };

    // Directors Data
    const directorsData = [
      {
        name: 'Rajesh Kumar',
        position: 'Co-Founder & Director',
        image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
        qualification: 'MBA, B.Tech Electrical Engineering',
        experience: '15+ years',
        message: 'With over 15 years of experience in renewable energy sector, I am committed to leading our strategic vision and driving sustainable energy solutions across India. Our mission is to make solar energy accessible and affordable for every household and business.',
        vision: 'To transform India into a solar-powered nation by providing innovative, reliable, and cost-effective renewable energy solutions that contribute to a sustainable future for generations to come.',
        socialLinks: [
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/rajeshkumar'
          },
          {
            platform: 'Email',
            url: 'mailto:rajesh@cosmicpowertech.com'
          }
        ],
        order: 1,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Priya Sharma',
        position: 'Co-Founder & Director',
        image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
        qualification: 'M.Tech Renewable Energy, B.Tech Mechanical Engineering',
        experience: '12+ years',
        message: 'As a passionate advocate for sustainable energy, I bring extensive expertise in project management and renewable energy solutions. My focus is on operational excellence and ensuring every project delivers maximum value to our clients.',
        vision: 'To establish Cosmic Powertech as the leading renewable energy company in India, known for innovation, quality, and customer satisfaction in every solar installation we undertake.',
        socialLinks: [
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/priyasharma'
          },
          {
            platform: 'Email',
            url: 'mailto:priya@cosmicpowertech.com'
          }
        ],
        order: 2,
        isActive: true,
        isFeatured: true
      }
    ];

    // Director CTA Data
    const directorCTAData = {
      title: 'Ready to Transform Your Energy Future?',
      description: 'Connect with our leadership team to discuss your solar energy requirements and sustainable solutions.',
      buttonText: 'Schedule a Meeting',
      buttonLink: '/contact',
      backgroundImage: '/images/director-cta-bg.jpg',
      isActive: true
    };

    // Team Members Data
    const teamMembersData = [
      {
        name: 'Amit Patel',
        position: 'Senior Solar Engineer',
        department: 'Engineering',
        bio: 'Expert in solar system design and installation with 8+ years of experience in renewable energy projects.',
        image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
        email: 'amit@cosmicpowertech.com',
        phone: '+91 9876543212',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/amitpatel'
        },
        skills: ['AutoCAD', 'PVsyst', 'Solar Design', 'Project Management'],
        order: 1,
        isActive: true,
        featured: true
      },
      {
        name: 'Sneha Gupta',
        position: 'Project Manager',
        department: 'Operations',
        bio: 'Experienced project manager specializing in large-scale solar installations and client relationship management.',
        image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
        email: 'sneha@cosmicpowertech.com',
        phone: '+91 9876543213',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/snehagupta'
        },
        skills: ['Project Planning', 'Team Leadership', 'Client Management', 'Quality Control'],
        order: 2,
        isActive: true,
        featured: true
      },
      {
        name: 'Vikash Singh',
        position: 'Sales Manager',
        department: 'Sales',
        bio: 'Dynamic sales professional with proven track record in renewable energy sector and customer acquisition.',
        image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
        email: 'vikash@cosmicpowertech.com',
        phone: '+91 9876543214',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/vikashsingh'
        },
        skills: ['Sales Strategy', 'Market Analysis', 'Customer Relations', 'Business Development'],
        order: 3,
        isActive: true,
        featured: false
      },
      {
        name: 'Ravi Kumar',
        position: 'Technical Lead',
        department: 'Engineering',
        bio: 'Technical expert in solar technology with deep knowledge of system optimization and maintenance.',
        image: 'https://zolar.wpengine.com/wp-content/uploads/2025/01/Home1-Team-img11.jpg',
        email: 'ravi@cosmicpowertech.com',
        phone: '+91 9876543215',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/ravikumar'
        },
        skills: ['Solar Technology', 'System Design', 'Troubleshooting', 'Team Leadership'],
        order: 4,
        isActive: true,
        featured: true
      }
    ];

    // Create new data
    const directorHero = await DirectorHero.create(directorHeroData);
    console.log('Created Director Hero:', directorHero._id);

    const directors = await Director.insertMany(directorsData);
    console.log('Created Directors:', directors.length);

    const directorCTA = await DirectorCTA.create(directorCTAData);
    console.log('Created Director CTA:', directorCTA._id);

    console.log('About to insert team members:', teamMembersData.length);
    console.log('Sample team member data:', JSON.stringify(teamMembersData[0], null, 2));
    
    let teamMembers;
    try {
      // Insert team members one by one to ensure each is saved
      teamMembers = [];
      for (let i = 0; i < teamMembersData.length; i++) {
        const member = await Team.create(teamMembersData[i]);
        teamMembers.push(member);
        console.log(`Created team member ${i + 1}: ${member.name} (${member._id})`);
      }
      
      console.log('Created Team Members:', teamMembers.length);
      
      // Verify insertion with a small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const verifyCount = await Team.countDocuments({});
      console.log('Verification: Team members in DB:', verifyCount);
      
      if (verifyCount === 0) {
        console.error('❌ Team members were not saved to database!');
        throw new Error('Team members insertion failed');
      }
      
    } catch (teamError) {
      console.error('Error inserting team members:', teamError);
      throw teamError;
    }

    console.log('\n✅ All Director and Team data populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Director Hero: ${directorHero._id}`);
    console.log(`- Directors: ${directors.length} created`);
    console.log(`- Director CTA: ${directorCTA._id}`);
    console.log(`- Team Members: ${teamMembers.length} created`);

  } catch (error) {
    console.error('Error populating director and team data:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run the script
populateDirectorTeamData();