import mongoose from 'mongoose';

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Director position is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Director image is required']
  },
  qualification: {
    type: String,
    required: [true, 'Director qualification is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Director experience is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Director message is required']
  },
  vision: {
    type: String,
    required: [true, 'Director vision is required']
  },
  socialLinks: [{
    platform: {
      type: String,
      required: true,
      enum: ['LinkedIn', 'Twitter', 'Email', 'Facebook', 'Instagram']
    },
    url: {
      type: String,
      required: true
    }
  }],
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

// Index for ordering
directorSchema.index({ order: 1 });

const Director = mongoose.model('Director', directorSchema);

export default Director;