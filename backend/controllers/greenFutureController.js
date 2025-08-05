import asyncHandler from 'express-async-handler';
import { GreenFuture } from '../models/index.js';

// @desc    Get active GreenFuture data
// @route   GET /api/green-future
// @access  Public
export const getGreenFuture = asyncHandler(async (req, res) => {
  console.log('Getting active GreenFuture data');
  const greenFuture = await GreenFuture.findOne({ isActive: true });
  
  if (!greenFuture) {
    console.log('No active GreenFuture data found, returning default structure');
    // If no active GreenFuture data exists, return a default structure
    return res.json({
      title: 'ENABLING A GREEN FUTURE',
      description: 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.',
      ctaText: 'LEARN MORE',
      ctaLink: '/green-future',
      newsCards: []
    });
  }
  
  // Ensure newsCards is always an array
  const responseData = greenFuture.toObject();
  if (!responseData.newsCards) {
    console.log('newsCards is undefined, setting to empty array');
    responseData.newsCards = [];
  }
  
  console.log('Returning GreenFuture data with newsCards:', 
    responseData.newsCards ? `${responseData.newsCards.length} cards` : 'undefined');
  
  res.json(responseData);
});

// @desc    Create or update GreenFuture data
// @route   POST /api/green-future
// @access  Private/Admin
export const createOrUpdateGreenFuture = asyncHandler(async (req, res) => {
  const { title, description, ctaText, ctaLink, newsCards, isActive } = req.body;

  // Find existing GreenFuture data
  let greenFuture = await GreenFuture.findOne();

  if (greenFuture) {
    // Update existing GreenFuture data
    greenFuture.title = title || greenFuture.title;
    greenFuture.description = description || greenFuture.description;
    greenFuture.ctaText = ctaText || greenFuture.ctaText;
    greenFuture.ctaLink = ctaLink || greenFuture.ctaLink;
    
    if (newsCards && newsCards.length > 0) {
      greenFuture.newsCards = newsCards;
    }
    
    if (isActive !== undefined) {
      greenFuture.isActive = isActive;
    }

    await greenFuture.save();
    res.status(200).json(greenFuture);
  } else {
    // Create new GreenFuture data
    greenFuture = await GreenFuture.create({
      title,
      description,
      ctaText,
      ctaLink,
      newsCards: newsCards || [],
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(greenFuture);
  }
});

// @desc    Add a news card to GreenFuture
// @route   POST /api/green-future/news
// @access  Private/Admin
export const addNewsCard = asyncHandler(async (req, res) => {
  try {
    const { title, image, logo, date, excerpt, content, order } = req.body;
    console.log('Add News Card - Request body:', req.body);
    console.log('Add News Card - User:', req.user ? req.user.email : 'No user');
    console.log('Add News Card - User role:', req.user ? req.user.role : 'No role');

    // Validate required fields
    if (!title || !image || !date || !excerpt || !content) {
      console.log('Add News Card - Validation failed:', {
        title: !!title,
        image: !!image,
        date: !!date,
        excerpt: !!excerpt,
        content: !!content
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, image, date, excerpt, content'
      });
    }

    // Find existing GreenFuture data or create one
    let greenFuture = await GreenFuture.findOne({ isActive: true });
    console.log('Found existing GreenFuture data:', greenFuture ? 'Yes' : 'No');
    
    if (greenFuture && greenFuture.newsCards) {
      console.log('Existing News Cards count:', greenFuture.newsCards.length);
      console.log('Existing News Cards IDs:', greenFuture.newsCards.map(card => card._id));
    }

    if (!greenFuture) {
      console.log('Creating new GreenFuture data with default values');
      // Create new GreenFuture data with default values
      greenFuture = await GreenFuture.create({
        title: 'ENABLING A GREEN FUTURE',
        description: 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.',
        ctaText: 'LEARN MORE',
        ctaLink: '/green-future',
        newsCards: [],
        isActive: true
      });
      console.log('New GreenFuture created:', greenFuture._id);
    }

    // Add new news card
    const newCard = {
      title: title.trim(),
      image: typeof image === 'string' ? image.trim() : (image.url || image.backendUrl || image),
      logo: logo ? (typeof logo === 'string' ? logo.trim() : (logo.url || logo.backendUrl || logo)) : '/logo.png',
      date: date.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      order: parseInt(order) || 0
    };
    console.log('Adding new news card:', newCard);
    greenFuture.newsCards.push(newCard);

    // Sort news cards by order
    greenFuture.newsCards.sort((a, b) => a.order - b.order);

    const savedGreenFuture = await greenFuture.save();
    console.log('News card added successfully');
    
    res.status(201).json({
      success: true,
      message: 'News card added successfully',
      data: savedGreenFuture
    });
  } catch (error) {
    console.error('Error in addNewsCard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add news card',
      error: error.message
    });
  }
});

// @desc    Update a news card
// @route   PUT /api/green-future/news/:id
// @access  Private/Admin
export const updateNewsCard = asyncHandler(async (req, res) => {
  const { title, image, logo, date, excerpt, content, order } = req.body;
  console.log('Update News Card - Request params ID:', req.params.id);
  console.log('Update News Card - Request body:', req.body);

  // Find existing GreenFuture data
  const greenFuture = await GreenFuture.findOne({ isActive: true });
  console.log('Found GreenFuture data:', greenFuture ? 'Yes' : 'No');
  
  if (greenFuture && greenFuture.newsCards) {
    console.log('News Cards IDs:', greenFuture.newsCards.map(card => card._id));
  }

  if (!greenFuture) {
    console.error('GreenFuture data not found');
    res.status(404);
    throw new Error('GreenFuture data not found');
  }

  // Find the news card by ID
  const newsCard = greenFuture.newsCards.id(req.params.id);
  console.log('Found news card:', newsCard ? 'Yes' : 'No');

  if (!newsCard) {
    console.error('News card not found with ID:', req.params.id);
    res.status(404);
    throw new Error('News card not found');
  }

  // Update news card
  newsCard.title = title || newsCard.title;
  newsCard.image = image ? (typeof image === 'string' ? image : (image.url || image.backendUrl || image)) : newsCard.image;
  newsCard.logo = logo ? (typeof logo === 'string' ? logo : (logo.url || logo.backendUrl || logo)) : newsCard.logo;
  newsCard.date = date || newsCard.date;
  newsCard.excerpt = excerpt || newsCard.excerpt;
  newsCard.content = content || newsCard.content;
  newsCard.order = order !== undefined ? order : newsCard.order;

  // Sort news cards by order
  greenFuture.newsCards.sort((a, b) => a.order - b.order);

  await greenFuture.save();
  res.status(200).json(greenFuture);
});

// @desc    Delete a news card
// @route   DELETE /api/green-future/news/:id
// @access  Private/Admin
export const deleteNewsCard = asyncHandler(async (req, res) => {
  console.log('Delete News Card - Request params ID:', req.params.id);
  
  // Find existing GreenFuture data
  const greenFuture = await GreenFuture.findOne({ isActive: true });
  console.log('Found GreenFuture data:', greenFuture ? 'Yes' : 'No');
  
  if (greenFuture && greenFuture.newsCards) {
    console.log('News Cards IDs before deletion:', greenFuture.newsCards.map(card => card._id));
  }

  if (!greenFuture) {
    console.error('GreenFuture data not found');
    res.status(404);
    throw new Error('GreenFuture data not found');
  }

  // Find the news card by ID
  const newsCard = greenFuture.newsCards.id(req.params.id);
  console.log('Found news card to delete:', newsCard ? 'Yes' : 'No');

  if (!newsCard) {
    console.error('News card not found with ID:', req.params.id);
    res.status(404);
    throw new Error('News card not found');
  }

  // Remove news card
  greenFuture.newsCards.pull(req.params.id);

  await greenFuture.save();
  res.status(200).json({ message: 'News card removed' });
});