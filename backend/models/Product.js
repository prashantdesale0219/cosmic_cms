import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  oldPrice: {
    type: String,
    required: [true, 'Old price is required']
  },
  newPrice: {
    type: String,
    required: [true, 'New price is required']
  },
  status: [{
    type: String,
    enum: ['Sale', 'Sold', 'New'],
    default: 'New'
  }],
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  hoverImage: {
    type: String,
    required: [true, 'Product hover image is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['solar-panels', 'inverters', 'batteries', 'accessories']
  },
  specifications: {
    power: String,
    voltage: String,
    weight: String,
    dimensions: String,
    efficiency: String,
    waterproof: String,
    warranty: String,
    batteryType: String,
    chargingTime: String,
    batteryCapacity: String,
    runtime: String
  },
  features: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  additionalImages: [{
    type: String
  }],
  reviews: [{
    user: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create text index for search functionality
productSchema.index({ title: 'text', description: 'text' });

// Auto-generate slug from title if not provided
productSchema.pre('save', function(next) {
  if (!this.isModified('title') || this.slug) {
    return next();
  }
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;