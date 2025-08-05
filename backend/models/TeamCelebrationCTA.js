import mongoose from 'mongoose';

const teamCelebrationCTASchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Join Our Award-Winning Team'
  },
  description: {
    type: String,
    required: true,
    default: 'Be part of a culture that celebrates success, fosters innovation, and values every team member\'s contribution.'
  },
  buttonText: {
    type: String,
    required: true,
    default: 'View Open Positions'
  },
  buttonLink: {
    type: String,
    required: true,
    default: '/careers'
  },
  backgroundColor: {
    type: String,
    default: '#13181f'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TeamCelebrationCTA', teamCelebrationCTASchema);