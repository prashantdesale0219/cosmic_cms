import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time'
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  salary: {
    type: String,
    trim: true
  },
  applicationEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  applicationUrl: {
    type: String,
    trim: true
  },
  applicationDeadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create text index for search functionality
careerSchema.index({ title: 'text', description: 'text', department: 'text', location: 'text' });

// Auto-generate slug from title if not provided
careerSchema.pre('save', function(next) {
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

const Career = mongoose.model('Career', careerSchema);

export default Career;