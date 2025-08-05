import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'About Us :'
  },
  description: {
    type: String,
    required: true,
    default: 'Cosmic Powertech is a Surat-based solar energy company founded in 2018 by brothers Chaitanya Shah and Charchil Shah. Established with the vision of making clean energy accessible and affordable across India, the company has rapidly emerged as a trusted provider of end-to-end renewable energy solutions for both residential and commercial sectors.'
  },
  additionalDescription: {
    type: String,
    default: 'Specializing in a diverse portfolio that includes rooftop solar installations, ongrid and off-grid power plants, solar water heaters, and custom solutions for industries such as textiles, hospitality, pharmaceuticals, petroleum, FMCG, PACKAGING. Cosmic Powertech offers comprehensive services from initial consultation to installation and long-term maintenance. Their in-house team of skilled engineers and sales professionals ensure high- quality execution and unmatched responsiveness, positioning the company to meet the evolving demands of India\'s growing solar market.'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('AboutUs', aboutUsSchema);