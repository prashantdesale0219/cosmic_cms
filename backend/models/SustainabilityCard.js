import mongoose from 'mongoose';

const sustainabilityCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  imageAlt: {
    type: String,
    required: [true, 'Image alt text is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Environmental', 'Society', 'Governance']
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

// Add index for ordering
sustainabilityCardSchema.index({ order: 1 });

const SustainabilityCard = mongoose.model('SustainabilityCard', sustainabilityCardSchema);

export default SustainabilityCard;