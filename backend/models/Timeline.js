import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, 'Year is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  backgroundImage: {
    type: String,
    required: [true, 'Background image is required'],
    trim: true
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

// Index for sorting
timelineSchema.index({ order: 1, year: 1 });

export default mongoose.model('Timeline', timelineSchema);