import mongoose from 'mongoose';

const coreValueSchema = new mongoose.Schema({
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
    required: [true, 'Icon is required'],
    enum: ['FaLeaf', 'FaSolarPanel', 'FaHandshake', 'FaLightbulb', 'FaUsers', 'FaHeart', 'FaShield', 'FaRocket']
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
coreValueSchema.index({ order: 1 });

const CoreValue = mongoose.model('CoreValue', coreValueSchema);

export default CoreValue;