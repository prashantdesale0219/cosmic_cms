import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image', 'video', 'document', 'audio', 'other'],
    default: 'image'
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  fullUrl: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  dimensions: {
    width: Number,
    height: Number
  },
  duration: {
    type: Number // For video/audio in seconds
  },
  alt: {
    type: String,
    trim: true
  },
  caption: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  folder: {
    type: String,
    default: 'uploads',
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create text index for search functionality
mediaSchema.index({ name: 'text', originalName: 'text', alt: 'text', caption: 'text', tags: 'text' });

const Media = mongoose.model('Media', mediaSchema);

export default Media;