import { Hero } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new hero slide
// @route   POST /api/hero
// @access  Private/Admin
export const createHeroSlide = async (req, res) => {
  try {
    const { key, num, railTitle, subtitle, title, body, img, icon, order, isActive } = req.body;

    // Check if slide with the same key already exists
    const slideExists = await Hero.findOne({ key });

    if (slideExists) {
      return res.status(400).json({
        success: false,
        message: 'A slide with this key already exists'
      });
    }

    // Create new hero slide
    const heroSlide = await Hero.create({
      key,
      num,
      railTitle,
      subtitle,
      title,
      body,
      img,
      icon,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      data: heroSlide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all hero slides
// @route   GET /api/hero
// @access  Public
export const getHeroSlides = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(Hero.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const heroSlides = await features.query;

    // Get total count for pagination
    const totalSlides = await Hero.countDocuments(features.query._conditions);
    
    // Get server URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // Process slides to ensure image URLs are complete
    const processedSlides = heroSlides.map(slide => {
      const slideObj = slide.toObject();
      
      // If img starts with /uploads/, add the full URL
      if (slideObj.img && slideObj.img.startsWith('/uploads/')) {
        slideObj.fullUrl = `${baseUrl}${slideObj.img}`;
      }
      
      return slideObj;
    });

    res.json({
      success: true,
      count: processedSlides.length,
      total: totalSlides,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalSlides / features.pagination.limit)
      },
      data: processedSlides
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active hero slides
// @route   GET /api/hero/active
// @access  Public
export const getActiveHeroSlides = async (req, res) => {
  try {
    console.log('Fetching active hero slides');
    const heroSlides = await Hero.find({ isActive: true }).sort('order');
    console.log(`Found ${heroSlides.length} active hero slides`);
    
    // Get server URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    console.log('Base URL for media:', baseUrl);
    
    // Process slides to ensure image URLs are complete
    const processedSlides = heroSlides.map(slide => {
      const slideObj = slide.toObject();
      
      // If img starts with /uploads/, add the full URL
      if (slideObj.img && slideObj.img.startsWith('/uploads/')) {
        slideObj.fullUrl = `${baseUrl}${slideObj.img}`;
      }
      
      return slideObj;
    });

    console.log('Returning processed slides:', processedSlides.length);
    res.json({
      success: true,
      count: processedSlides.length,
      data: processedSlides
    });
  } catch (error) {
    console.error('Error in getActiveHeroSlides:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get hero slide by ID
// @route   GET /api/hero/:id
// @access  Public
export const getHeroSlideById = async (req, res) => {
  try {
    const heroSlide = await Hero.findById(req.params.id);

    if (!heroSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    // Get server URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // Process slide to ensure image URL is complete
    const slideObj = heroSlide.toObject();
    
    // If img starts with /uploads/, add the full URL
    if (slideObj.img && slideObj.img.startsWith('/uploads/')) {
      slideObj.fullUrl = `${baseUrl}${slideObj.img}`;
    }

    res.json({
      success: true,
      data: slideObj
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update hero slide
// @route   PUT /api/hero/:id
// @access  Private/Admin
export const updateHeroSlide = async (req, res) => {
  try {
    const heroSlide = await Hero.findById(req.params.id);

    if (!heroSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    // Check if updating key and if it already exists
    if (req.body.key && req.body.key !== heroSlide.key) {
      const keyExists = await Hero.findOne({ key: req.body.key });
      if (keyExists) {
        return res.status(400).json({
          success: false,
          message: 'A slide with this key already exists'
        });
      }
    }

    // Update fields
    const updatedHeroSlide = await Hero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedHeroSlide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete hero slide
// @route   DELETE /api/hero/:id
// @access  Private/Admin
export const deleteHeroSlide = async (req, res) => {
  try {
    const heroSlide = await Hero.findById(req.params.id);

    if (!heroSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    await Hero.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Hero slide removed'
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured hero slides
// @route   GET /api/hero/featured
// @access  Public
export const getFeaturedHeroSlides = async (req, res) => {
  try {
    const heroSlides = await Hero.find({ isActive: true, isFeatured: true }).sort('order');

    res.json({
      success: true,
      count: heroSlides.length,
      data: heroSlides
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update hero slide order
// @route   PUT /api/hero/reorder
// @access  Private/Admin
export const reorderHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: 'Slides array is required'
      });
    }

    // Update order for each slide
    const updatePromises = slides.map(slide => {
      return Hero.findByIdAndUpdate(
        slide.id,
        { order: slide.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated slides
    const updatedSlides = await Hero.find().sort('order');

    res.json({
      success: true,
      message: 'Slides reordered successfully',
      data: updatedSlides
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};