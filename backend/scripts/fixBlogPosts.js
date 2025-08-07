import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost.js';

// Load environment variables
dotenv.config();

const fixBlogPosts = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cosmic-website-cms';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Update all blog posts to be published and active
    const result = await BlogPost.updateMany(
      {}, // Update all blog posts
      { 
        $set: { 
          isPublished: true,
          isActive: true 
        } 
      }
    );

    console.log(`Updated ${result.modifiedCount} blog posts`);
    
    // Verify the update
    const activePosts = await BlogPost.find({ isPublished: true, isActive: true });
    console.log(`Found ${activePosts.length} active and published blog posts:`);
    activePosts.forEach(post => {
      console.log(`- ${post.title} (Published: ${post.isPublished}, Active: ${post.isActive})`);
    });

  } catch (error) {
    console.error('Error fixing blog posts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

fixBlogPosts();