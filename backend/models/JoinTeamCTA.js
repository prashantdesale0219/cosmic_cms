import mongoose from 'mongoose';

const joinTeamCTASchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Join Our'
  },
  highlightText: {
    type: String,
    default: 'Team'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    default: 'We\'re always looking for talented individuals who share our passion for renewable energy and sustainability. Explore our current openings and become part of our mission to create a greener future.'
  },
  ctaText: {
    type: String,
    default: 'View Career Opportunities'
  },
  ctaLink: {
    type: String,
    default: '/careers'
  },
  backgroundColor: {
    type: String,
    default: '#f9fafb'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const JoinTeamCTA = mongoose.model('JoinTeamCTA', joinTeamCTASchema);

export default JoinTeamCTA;