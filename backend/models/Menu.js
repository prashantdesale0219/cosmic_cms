import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Menu item title is required'],
    trim: true
  },
  path: {
    type: String,
    required: [true, 'Menu item path is required'],
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  target: {
    type: String,
    enum: ['_self', '_blank', '_parent', '_top'],
    default: '_self'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
});

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu name is required'],
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
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    enum: ['header', 'footer', 'sidebar', 'mobile', 'other'],
    default: 'header'
  },
  items: [menuItemSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Auto-generate slug from name if not provided
menuSchema.pre('save', function(next) {
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

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;