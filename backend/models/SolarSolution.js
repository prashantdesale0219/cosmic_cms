import mongoose from 'mongoose';

const solarSolutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Solution title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Solution description is required']
  },
  image: {
    type: String,
    required: [true, 'Solution image is required']
  },
  category: {
    type: String,
    required: [true, 'Solution category is required'],
    trim: true
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
solarSolutionSchema.index({ title: 'text', description: 'text', category: 'text' });

// Auto-generate slug from title if not provided
solarSolutionSchema.pre('save', function(next) {
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

const SolarSolution = mongoose.model('SolarSolution', solarSolutionSchema);

export default SolarSolution;