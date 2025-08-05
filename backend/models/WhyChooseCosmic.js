import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
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
    default: 'default-icon'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const whyChooseCosmicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Why Choose Cosmic?'
  },
  highlightText: {
    type: String,
    default: 'Cosmic'
  },
  features: [featureSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('WhyChooseCosmic', whyChooseCosmicSchema);