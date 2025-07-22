import asyncHandler from 'express-async-handler';
import Hero from '../models/Hero.js';
import EnergySolution from '../models/EnergySolution.js';
import Faq from '../models/Faq.js';
import BlogPost from '../models/BlogPost.js';
import Product from '../models/Product.js';
import Project from '../models/Project.js';
import Contact from '../models/Contact.js';
import Testimonial from '../models/Testimonial.js';
import Team from '../models/Team.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import Setting from '../models/Setting.js';

// @desc    Get all data for homepage
// @route   GET /api/frontend/homepage
// @access  Public
export const getHomepageData = asyncHandler(async (req, res) => {
  // Get featured hero slides
  const heroes = await Hero.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(5);

  // Get featured energy solutions
  const energySolutions = await EnergySolution.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(6);

  // Get featured products
  const products = await Product.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(8);

  // Get featured projects
  const projects = await Project.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(6);

  // Get featured testimonials
  const testimonials = await Testimonial.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(6);

  // Get featured team members
  const teamMembers = await Team.find({ isActive: true, featured: true })
    .sort({ order: 1 })
    .limit(4);

  // Get featured blog posts
  const blogPosts = await BlogPost.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(3);

  // Get FAQs
  const faqs = await Faq.find({ isActive: true })
    .sort({ order: 1 })
    .limit(6);

  // Get settings
  const settings = await Setting.findOne();

  res.json({
    heroes,
    energySolutions,
    products,
    projects,
    testimonials,
    teamMembers,
    blogPosts,
    faqs,
    settings
  });
});

// @desc    Get all data for about page
// @route   GET /api/frontend/about
// @access  Public
export const getAboutPageData = asyncHandler(async (req, res) => {
  // Get team members
  const teamMembers = await Team.find({ isActive: true })
    .sort({ order: 1 });

  // Get testimonials
  const testimonials = await Testimonial.find({ isActive: true })
    .sort({ order: 1 });

  // Get settings
  const settings = await Setting.findOne();

  res.json({
    teamMembers,
    testimonials,
    settings
  });
});

// @desc    Update homepage data
// @route   POST /api/frontend/homepage
// @access  Public
export const updateHomepageData = asyncHandler(async (req, res) => {
  try {
    // Get settings from request body
    const { settings } = req.body;
    
    // Find and update settings
    let existingSettings = await Setting.findOne();
    
    if (!existingSettings) {
      // If settings don't exist, create them
      existingSettings = await Setting.create(settings);
    } else {
      // Update existing settings
      existingSettings = await Setting.findByIdAndUpdate(
        existingSettings._id,
        settings,
        { new: true, runValidators: true }
      );
    }
    
    // Get updated homepage data
    // Get featured hero slides
    const heroes = await Hero.find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(5);

    // Get featured energy solutions
    const energySolutions = await EnergySolution.find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(6);

    // Get featured products
    const products = await Product.find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(8);

    // Get featured projects
    const projects = await Project.find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(6);

    // Get featured testimonials
    const testimonials = await Testimonial.find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(6);

    // Get featured team members
    const teamMembers = await Team.find({ isActive: true, featured: true })
      .sort({ order: 1 })
      .limit(4);

    // Get featured blog posts
    const blogPosts = await BlogPost.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(3);

    // Get FAQs
    const faqs = await Faq.find({ isActive: true })
      .sort({ order: 1 })
      .limit(6);
    
    res.status(200).json({
      success: true,
      data: {
        heroes,
        energySolutions,
        products,
        projects,
        testimonials,
        teamMembers,
        blogPosts,
        faqs,
        settings: existingSettings
      },
      message: 'Homepage data updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Submit contact form
// @route   POST /api/frontend/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const { 
    fullName, 
    name, 
    email, 
    phone, 
    whatsapp, 
    message, 
    systemType, 
    address, 
    city, 
    pincode, 
    requirements 
  } = req.body;

  // Use fullName if provided, otherwise use name
  const contactName = fullName || name;
  // Use whatsapp if provided, otherwise use phone
  const contactPhone = whatsapp || phone;

  if (!contactName || !contactPhone) {
    res.status(400);
    throw new Error('Please provide name and contact number');
  }

  const contact = await Contact.create({
    fullName: contactName,
    email,
    phone: contactPhone,
    message,
    systemType,
    address,
    city,
    pincode,
    requirements,
    status: 'new'
  });

  if (contact) {
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      contact
    });
  } else {
    res.status(400);
    throw new Error('Invalid contact data');
  }
});