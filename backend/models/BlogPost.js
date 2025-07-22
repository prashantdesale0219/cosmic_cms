import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  image: {
    type: String,
    required: [true, 'Featured image URL is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    trim: true
  }],
  publishDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create text index for search functionality
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Auto-generate slug from title if not provided
blogPostSchema.pre('save', function(next) {
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

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;