import mongoose from 'mongoose';

const directorHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Hero title is required'],
    default: "Director's Desk"
  },
  subtitle: {
    type: String,
    default: 'Meet Our Leadership Team'
  },
  backgroundVideo: {
    type: String,
    required: [true, 'Background video is required'],
    default: '/directordesk.mp4'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  breadcrumbs: [{
    label: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const DirectorHero = mongoose.model('DirectorHero', directorHeroSchema);

export default DirectorHero;