import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/back_Image.avif'
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const ourExpertiseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Our Expertise'
  },
  subtitle: {
    type: String,
    default: 'We are hands down our expertise in product distributorship.'
  },
  industries: [industrySchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('OurExpertise', ourExpertiseSchema);