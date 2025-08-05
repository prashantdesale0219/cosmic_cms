import mongoose from 'mongoose';

const savingsCalculatorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Calculate Your Savings'
  },
  description: {
    type: String,
    default: 'Find out how much you can save by switching to solar energy.'
  },
  monthlyBillLabel: {
    type: String,
    default: 'Monthly Electricity Bill'
  },
  sunlightHoursLabel: {
    type: String,
    default: 'Daily Sunlight Hours'
  },
  roofSizeLabel: {
    type: String,
    default: 'Roof Size (sq ft)'
  },
  calculateButtonText: {
    type: String,
    default: 'Calculate Savings'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('SavingsCalculator', savingsCalculatorSchema);