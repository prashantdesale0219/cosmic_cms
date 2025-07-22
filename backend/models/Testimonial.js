import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  quote: {
    type: String,
    required: [true, 'Quote is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  projectType: {
    type: String,
    trim: true
  },
  location: {
    type: String,
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
  },
  videoUrl: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;