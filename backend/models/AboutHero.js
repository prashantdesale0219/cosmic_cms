import mongoose from 'mongoose';

const aboutHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'About'
  },
  videoUrl: {
    type: String,
    required: true,
    default: '/aboutvideo.mp4'
  },
  breadcrumbHome: {
    type: String,
    default: 'Home'
  },
  breadcrumbCurrent: {
    type: String,
    default: 'About'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('AboutHero', aboutHeroSchema);