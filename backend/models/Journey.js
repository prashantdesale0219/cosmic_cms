import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
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
    required: [true, 'Description is required']
  },
  icon: {
    type: String,
    default: ''
  },
  image: {
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

const Journey = mongoose.model('Journey', journeySchema);

export default Journey;