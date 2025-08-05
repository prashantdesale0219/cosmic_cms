import mongoose from 'mongoose';

const directorCTASchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'CTA title is required'],
    default: 'Join Us in Our Solar Mission'
  },
  description: {
    type: String,
    required: [true, 'CTA description is required'],
    default: 'Whether you\'re looking to power your home, business, or join our team, we invite you to be part of our journey towards a sustainable future.'
  },
  primaryButton: {
    text: {
      type: String,
      required: true,
      default: 'Contact Us'
    },
    url: {
      type: String,
      required: true,
      default: '/contact'
    }
  },
  secondaryButton: {
    text: {
      type: String,
      required: true,
      default: 'Join Our Team'
    },
    url: {
      type: String,
      required: true,
      default: '/careers'
    }
  },
  backgroundColor: {
    type: String,
    default: 'bg-primary-600'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const DirectorCTA = mongoose.model('DirectorCTA', directorCTASchema);

export default DirectorCTA;