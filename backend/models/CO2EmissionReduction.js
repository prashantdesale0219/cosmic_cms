import mongoose from 'mongoose';

const co2EmissionReductionSchema = new mongoose.Schema({
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
    default: 'fa-leaf'
  },
  image: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    required: [true, 'CO2 reduction value is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit of measurement is required'],
    default: 'tons'
  },
  timeframe: {
    type: String,
    required: [true, 'Timeframe is required'],
    default: 'per year'
  },
  methodology: {
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

const CO2EmissionReduction = mongoose.model('CO2EmissionReduction', co2EmissionReductionSchema);

export default CO2EmissionReduction;