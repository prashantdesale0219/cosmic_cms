import mongoose from 'mongoose';

const happyClientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  backgroundVideo: {
    type: String,
    trim: true
  },
  companyVideo: {
    type: String,
    trim: true
  },
  stats: [
    {
      value: {
        type: Number,
        required: [true, 'Value is required']
      },
      label: {
        type: String,
        required: [true, 'Label is required'],
        trim: true
      },
      icon: {
        type: String,
        enum: ['FaUsers', 'FaProjectDiagram', 'FaSolarPanel', 'FaBolt'],
        default: 'FaUsers'
      },
      color: {
        type: String,
        default: '#9fc22f'
      },
      suffix: {
        type: String,
        default: '+',
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      order: {
        type: Number,
        default: 0
      }
    }
  ],
  ctaText: {
    type: String,
    default: 'Learn More About Us',
    trim: true
  },
  ctaLink: {
    type: String,
    default: '/about',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const HappyClient = mongoose.model('HappyClient', happyClientSchema);

export default HappyClient;