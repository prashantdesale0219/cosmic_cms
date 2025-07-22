import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { Menu } from '../models/index.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create default header menu
const createDefaultMenu = async () => {
  try {
    // Check if header menu already exists
    const existingMenu = await Menu.findOne({ location: 'header' });
    
    if (existingMenu) {
      console.log('Header menu already exists'.yellow);
      process.exit();
    }
    
    // Create default menu items
    const menuItems = [
      {
        title: 'Home',
        path: '/',
        order: 1,
        isActive: true
      },
      {
        title: 'About',
        path: '/about',
        order: 2,
        isActive: true
      },
      {
        title: 'Products',
        path: '/products',
        order: 3,
        isActive: true
      },
      {
        title: 'Services',
        path: '/services',
        order: 4,
        isActive: true
      },
      {
        title: 'Projects',
        path: '/projects',
        order: 5,
        isActive: true
      },
      {
        title: 'Calculator',
        path: '/calculator',
        order: 6,
        isActive: true
      },
      {
        title: 'NewsRoom',
        path: '/blog',
        order: 7,
        isActive: true
      },
      {
        title: 'Contact',
        path: '/contact',
        order: 8,
        isActive: true
      }
    ];
    
    // Create the menu
    const menu = await Menu.create({
      name: 'Header Menu',
      slug: 'header-menu',
      description: 'Main navigation menu for the header',
      location: 'header',
      items: menuItems,
      isActive: true
    });
    
    console.log('Default header menu created'.green);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Run the function
createDefaultMenu();