import mongoose from 'mongoose';

const brandVisionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Brand Vision & Stratergy'
  },
  highlightText: {
    type: String,
    default: 'Brand Vision & Stratergy'
  },
  description1: {
    type: String,
    required: [true, 'First description is required'],
    default: 'To make our future more vibrant and sustainable by using green energy to save the earth.'
  },
  description2: {
    type: String,
    required: [true, 'Second description is required'],
    default: 'We are also committed to maintain our leadership position in the manufacture of solar products, delivering higher efficiency to the global photovoltaic industry.'
  },
  description3: {
    type: String,
    required: [true, 'Third description is required'],
    default: 'To achieve 8 GW production capacity by 2025 to serve green energy demand internationally.'
  },
  ctaText: {
    type: String,
    default: 'Join Our Mission'
  },
  ctaLink: {
    type: String,
    default: '/contact'
  },
  videoUrl: {
    type: String,
    default: '/company-culture.mp4'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const BrandVision = mongoose.model('BrandVision', brandVisionSchema);

export default BrandVision;