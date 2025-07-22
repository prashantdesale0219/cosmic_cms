import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Slide key is required'],
    unique: true,
    trim: true
  },
  num: {
    type: String,
    required: [true, 'Slide number is required']
  },
  railTitle: {
    type: String,
    required: [true, 'Rail title is required']
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required']
  },
  title: {
    type: [String],
    required: [true, 'Title is required'],
    validate: {
      validator: function(array) {
        return array.length === 2;
      },
      message: 'Title must have exactly two lines'
    }
  },
  body: {
    type: String,
    required: [true, 'Body text is required']
  },
  img: {
    type: String,
    required: [true, 'Image URL is required']
  },
  icon: {
    type: String,
    required: [true, 'SVG icon code is required']
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
    default: true
  }
}, { timestamps: true });

const Hero = mongoose.model('Hero', heroSlideSchema);

export default Hero;