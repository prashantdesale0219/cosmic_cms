import mongoose from 'mongoose';

const teamCelebrationHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Team Celebrations & Achievements'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'At SS Tech, we believe in celebrating our successes, recognizing excellence, and building a strong team culture.'
  },
  backgroundImage: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80'
  },
  eventsButtonText: {
    type: String,
    default: 'Upcoming Events'
  },
  achievementsButtonText: {
    type: String,
    default: 'Our Achievements'
  },
  breadcrumbHome: {
    type: String,
    default: 'Home'
  },
  breadcrumbCurrent: {
    type: String,
    default: 'Team Celebrations'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TeamCelebrationHero', teamCelebrationHeroSchema);