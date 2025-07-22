import { Product } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { 
      title, slug, oldPrice, newPrice, status, image, hoverImage,
      rating, category, specifications, features, description,
      additionalImages, stock, isActive, order 
    } = req.body;

    // Check if product with the same title or slug already exists
    const productExists = await Product.findOne({ 
      $or: [{ title }, { slug }] 
    });

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: 'A product with this title or slug already exists'
      });
    }

    // Create new product
    const product = await Product.create({
      title,
      slug: slug || undefined, // Let the pre-save hook generate if not provided
      oldPrice,
      newPrice,
      status: status || ['New'],
      image,
      hoverImage,
      rating: rating || 0,
      category,
      specifications: specifications || {},
      features: features || [],
      description,
      additionalImages: additionalImages || [],
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const products = await features.query;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalProducts / features.pagination.limit)
      },
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active products
// @route   GET /api/products/active
// @access  Public
export const getActiveProducts = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(
      Product.find({ isActive: true }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const products = await features.query;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({
      ...features.query._conditions,
      isActive: true
    });

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalProducts / features.pagination.limit)
      },
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    // Get featured and active products
    const products = await Product.find({ isActive: true, isFeatured: true }).sort('order');

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Initialize API features
    const features = new APIFeatures(
      Product.find({ 
        category,
        isActive: true 
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const products = await features.query;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({
      ...features.query._conditions,
      category,
      isActive: true
    });

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalProducts / features.pagination.limit)
      },
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    console.log('Update product request received for ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('Found product:', product);

    // Check if updating title/slug and if it already exists
    if ((req.body.title && req.body.title !== product.title) ||
        (req.body.slug && req.body.slug !== product.slug)) {
      console.log('Checking for duplicate title/slug');
      console.log('New title:', req.body.title, 'Old title:', product.title);
      console.log('New slug:', req.body.slug, 'Old slug:', product.slug);
      
      const titleOrSlugExists = await Product.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          { $or: [
            { title: req.body.title || '' },
            { slug: req.body.slug || '' }
          ]}
        ]
      });
      
      if (titleOrSlugExists) {
        console.log('Duplicate title/slug found:', titleOrSlugExists);
        return res.status(400).json({
          success: false,
          message: 'A product with this title or slug already exists'
        });
      }
    }

    // Update fields
    console.log('Updating product with data:', req.body);
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log('Product updated successfully:', updatedProduct);

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Using findByIdAndDelete instead of remove() which is deprecated
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product order
// @route   PUT /api/products/reorder
// @access  Private/Admin
export const reorderProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    // Update order for each product
    const updatePromises = products.map(product => {
      return Product.findByIdAndUpdate(
        product.id,
        { order: product.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated products
    const updatedProducts = await Product.find().sort('order');

    res.json({
      success: true,
      message: 'Products reordered successfully',
      data: updatedProducts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      date: Date.now()
    };

    product.reviews.push(review);

    // Update product rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
                     product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
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
      Product.find({ 
        $text: { $search: q },
        isActive: true 
      }),
      req.query
    )
      .sort()
      .limitFields()
      .paginate();

    // Execute query with text score sorting
    const products = await features.query
      .sort({ score: { $meta: 'textScore' } });

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({
      $text: { $search: q },
      isActive: true
    });

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalProducts / features.pagination.limit)
      },
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};