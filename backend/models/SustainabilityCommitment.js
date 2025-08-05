import mongoose from 'mongoose';

const sustainabilityCommitmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Our Commitment to'
  },
  highlightText: {
    type: String,
    default: 'Sustainability'
  },
  subtitle: {
    type: String,
    default: 'Beyond our products, we\'re committed to sustainable operations in every aspect of our business.'
  },
  commitments: [{
    title: {
      type: String,
      required: [true, 'Commitment title is required']
    },
    description: {
      type: String,
      required: [true, 'Commitment description is required']
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  backgroundColor: {
    type: String,
    default: '#003e63'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const SustainabilityCommitment = mongoose.model('SustainabilityCommitment', sustainabilityCommitmentSchema);

export default SustainabilityCommitment;