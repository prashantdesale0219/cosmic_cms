import mongoose from 'mongoose';
import slugify from 'slugify';

const energySolutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  icon: {
    type: String,
    required: [true, 'Icon name is required'],
    trim: true
  },
  img: {
    type: String,
    required: [true, 'Image URL is required']
  },
  description: {
    type: String,
    trim: true
  },
  order: {
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
  }
}, { timestamps: true });

// Pre-save hook to generate slug from title
energySolutionSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const EnergySolution = mongoose.model('EnergySolution', energySolutionSchema);

export default EnergySolution;