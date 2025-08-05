import mongoose from 'mongoose';

const whoWeAreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Who we are ?'
  },
  description: {
    type: String,
    required: true,
    default: 'Cosmic Powertech is a Surat-based solar energy company transforming the way India powers its future. Founded by Chaitanya and Charchil Shah, we specialize in end-to-end renewable energy solutions—rooftop systems, solar water heaters, and on/off-grid power plants—designed for homes, industries, and commercial spaces. With a focus on quality, affordability, and long-term service, we make clean energy reliable and accessible across India.'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('WhoWeAre', whoWeAreSchema);