import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
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
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Tag type is required'],
    enum: ['blog', 'product', 'project', 'media'],
    default: 'blog'
  },
  color: {
    type: String,
    default: '#3498db'
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  count: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create text index for search functionality
tagSchema.index({ name: 'text', description: 'text' });

// Auto-generate slug from name if not provided
tagSchema.pre('save', function(next) {
  if (!this.isModified('name') || this.slug) {
    return next();
  }
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  next();
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;