import mongoose from 'mongoose';

const intelligentSolutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  icon: {
    type: String,
    default: 'fa-lightbulb'
  },
  image: {
    type: String,
    default: ''
  },
  features: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'fa-check'
    }
  }],
  benefits: {
    type: String,
    default: ''
  },
  technologyUsed: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const IntelligentSolution = mongoose.model('IntelligentSolution', intelligentSolutionSchema);

export default IntelligentSolution;