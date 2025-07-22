import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Project location is required'],
    trim: true
  },
  completionDate: {
    type: Date,
    required: [true, 'Completion date is required']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  challenge: {
    type: String,
    trim: true
  },
  solution: {
    type: String,
    trim: true
  },
  results: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  images: [{
    type: String
  }],
  specifications: {
    systemSize: String,
    annualProduction: String,
    co2Offset: String,
    panelsUsed: String,
    inverterType: String
  },
  testimonial: {
    quote: String,
    author: String,
    position: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create text index for search functionality
projectSchema.index({ title: 'text', description: 'text', client: 'text', location: 'text' });

// Auto-generate slug from title if not provided
projectSchema.pre('save', function(next) {
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

const Project = mongoose.model('Project', projectSchema);

export default Project;