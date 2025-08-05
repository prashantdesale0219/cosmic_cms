import mongoose from 'mongoose';

const mainServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    required: true,
    default: 'https://zolar.wpengine.com/wp-content/uploads/2024/12/Home2-services-bg-img-1.jpg'
  },
  iconType: {
    type: String,
    enum: ['PvIcon', 'RepairIcon', 'PowerIcon'],
    default: 'PvIcon'
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

export default mongoose.model('MainService', mainServiceSchema);