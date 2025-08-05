import mongoose from 'mongoose';

const serviceCtaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Ready to Transform Your Energy Future?'
  },
  benefits: [{
    text: {
      type: String,
      required: true
    }
  }],
  ctaButtonText: {
    type: String,
    default: 'Get Started Today'
  },
  ctaButtonLink: {
    type: String,
    default: '/contact'
  },
  secondaryButtonText: {
    type: String,
    default: 'Request Free Quote'
  },
  secondaryButtonLink: {
    type: String,
    default: '/quote'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ServiceCta', serviceCtaSchema);