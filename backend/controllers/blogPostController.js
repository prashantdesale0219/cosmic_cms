import { BlogPost } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new blog post
// @route   POST /api/blog-posts
// @access  Private/Admin or Editor
export const createBlogPost = async (req, res) => {
  try {
    const { 
      title, slug, excerpt, content, image, author, 
      tags, categories, publishDate, isPublished, 
      metaTitle, metaDescription 
    } = req.body;

    // Check if blog post with the same title or slug already exists
    const postExists = await BlogPost.findOne({ 
      $or: [{ title }, { slug }] 
    });

    if (postExists) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this title or slug already exists'
      });
    }

    // Create new blog post
    const blogPost = await BlogPost.create({
      title,
      slug: slug || undefined, // Let the pre-save hook generate if not provided
      excerpt,
      content,
      image,
      author: author || req.user._id, // Default to current user if not specified
      tags: tags || [],
      categories: categories || [],
      publishDate: publishDate || Date.now(),
      isPublished: isPublished !== undefined ? isPublished : false,
      metaTitle: metaTitle || title, // Default to title if not provided
      metaDescription: metaDescription || excerpt // Default to excerpt if not provided
    });

    res.status(201).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all blog posts
// @route   GET /api/blog-posts
// @access  Public
export const getBlogPosts = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(BlogPost.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population
    const blogPosts = await features.query.populate({
      path: 'author',
      select: 'username name avatar'
    });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get published blog posts
// @route   GET /api/blog-posts/published
// @access  Public
export const getPublishedBlogPosts = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(
      BlogPost.find({ isPublished: true }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population
    const blogPosts = await features.query.populate({
      path: 'author',
      select: 'username name avatar'
    });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments({
      ...features.query._conditions,
      isPublished: true
    });

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog posts by category
// @route   GET /api/blog-posts/category/:category
// @access  Public
export const getBlogPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Initialize API features
    const features = new APIFeatures(
      BlogPost.find({ 
        categories: category,
        isPublished: true 
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population
    const blogPosts = await features.query.populate({
      path: 'author',
      select: 'username name avatar'
    });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments({
      ...features.query._conditions,
      categories: category,
      isPublished: true
    });

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog posts by tag
// @route   GET /api/blog-posts/tag/:tag
// @access  Public
export const getBlogPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    
    // Initialize API features
    const features = new APIFeatures(
      BlogPost.find({ 
        tags: tag,
        isPublished: true 
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population
    const blogPosts = await features.query.populate({
      path: 'author',
      select: 'username name avatar'
    });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments({
      ...features.query._conditions,
      tags: tag,
      isPublished: true
    });

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog post by ID
// @route   GET /api/blog-posts/:id
// @access  Public
export const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate({
      path: 'author',
      select: 'username name avatar'
    });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    blogPost.views += 1;
    await blogPost.save();

    res.json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog post by slug
// @route   GET /api/blog-posts/slug/:slug
// @access  Public
export const getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ 
      slug: req.params.slug 
    }).populate({
      path: 'author',
      select: 'username name avatar'
    });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    blogPost.views += 1;
    await blogPost.save();

    res.json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog-posts/:id
// @access  Private/Admin or Editor
export const updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is author or admin
    if (blogPost.author.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    // Check if updating title/slug and if it already exists
    if ((req.body.title && req.body.title !== blogPost.title) ||
        (req.body.slug && req.body.slug !== blogPost.slug)) {
      const titleOrSlugExists = await BlogPost.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          { $or: [
            { title: req.body.title || '' },
            { slug: req.body.slug || '' }
          ]}
        ]
      });
      
      if (titleOrSlugExists) {
        return res.status(400).json({
          success: false,
          message: 'A blog post with this title or slug already exists'
        });
      }
    }

    // Update fields
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'author',
      select: 'username name avatar'
    });

    res.json({
      success: true,
      data: updatedBlogPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog-posts/:id
// @access  Private/Admin or Editor
export const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is author or admin
    if (blogPost.author.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog post removed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search blog posts
// @route   GET /api/blog-posts/search
// @access  Public
export const searchBlogPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Initialize API features
    const features = new APIFeatures(
      BlogPost.find({ 
        $text: { $search: q },
        isPublished: true 
      }),
      req.query
    )
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population and text score sorting
    const blogPosts = await features.query
      .populate({
        path: 'author',
        select: 'username name avatar'
      })
      .sort({ score: { $meta: 'textScore' } });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments({
      $text: { $search: q },
      isPublished: true
    });

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active blog posts (published and active)
// @route   GET /api/blog-posts/active
// @access  Public
export const getActiveBlogPosts = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(
      BlogPost.find({ 
        isPublished: true,
        isActive: true
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population
    const blogPosts = await features.query.populate({
      path: 'author',
      select: 'username name avatar'
    });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments({
      ...features.query._conditions,
      isPublished: true,
      isActive: true
    });

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured blog posts (published, active and featured)
// @route   GET /api/blog-posts/featured
// @access  Public
export const getFeaturedBlogPosts = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(
      BlogPost.find({ 
        isPublished: true,
        isActive: true,
        isFeatured: true
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query with author population
    const blogPosts = await features.query.populate({
      path: 'author',
      select: 'username name avatar'
    });

    // Get total count for pagination
    const totalPosts = await BlogPost.countDocuments({
      ...features.query._conditions,
      isPublished: true,
      isActive: true,
      isFeatured: true
    });

    res.json({
      success: true,
      count: blogPosts.length,
      total: totalPosts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalPosts / features.pagination.limit)
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};