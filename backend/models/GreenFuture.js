import mongoose from 'mongoose';

const greenFutureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'ENABLING A GREEN FUTURE'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    default: 'Creating climate for change through thought leadership and raising awareness towards solar industry, aiding in realization of Aatmanirbhar and energy-rich India.'
  },
  ctaText: {
    type: String,
    default: 'LEARN MORE',
    trim: true
  },
  ctaLink: {
    type: String,
    default: '/green-future',
    trim: true
  },
  newsCards: [
    {
      title: {
        type: String,
        required: [true, 'News title is required'],
        trim: true
      },
      image: {
        type: String,
        required: [true, 'News image is required'],
        trim: true
      },
      logo: {
        type: String,
        default: '/logo.png',
        trim: true
      },
      date: {
        type: String,
        required: [true, 'News date is required'],
        trim: true
      },
      excerpt: {
        type: String,
        required: [true, 'News excerpt is required'],
        trim: true
      },
      content: {
        type: String,
        required: [true, 'News content is required'],
        trim: true
      },
      order: {
        type: Number,
        default: 0
      }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const GreenFuture = mongoose.model('GreenFuture', greenFutureSchema);

export default GreenFuture;