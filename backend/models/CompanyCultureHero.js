import mongoose from 'mongoose';

const companyCultureHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Company Culture'
  },
  backgroundImage: {
    type: String,
    required: [true, 'Background image is required'],
    default: '/companyculture.jpeg'
  },
  breadcrumbHome: {
    type: String,
    default: 'Home'
  },
  breadcrumbAbout: {
    type: String,
    default: 'About'
  },
  breadcrumbCurrent: {
    type: String,
    default: 'Company Culture'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const CompanyCultureHero = mongoose.model('CompanyCultureHero', companyCultureHeroSchema);

export default CompanyCultureHero;