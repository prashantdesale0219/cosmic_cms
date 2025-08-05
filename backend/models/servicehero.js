import mongoose from 'mongoose';

const serviceHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Services'
  },
  subtitle: {
    type: String,
    default: 'Solar-Powered Lighting Systems Projects'
  },
  videoUrl: {
    type: String,
    required: true,
    default: '/servicesvideo.mp4'
  },
  breadcrumbHome: {
    type: String,
    default: 'Home'
  },
  breadcrumbCurrent: {
    type: String,
    default: 'Services'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ServiceHero', serviceHeroSchema);