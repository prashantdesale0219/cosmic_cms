import mongoose from 'mongoose';

const workEnvironmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Our Work'
  },
  highlightText: {
    type: String,
    default: 'Environment'
  },
  description1: {
    type: String,
    required: [true, 'First description is required'],
    default: 'We foster a collaborative, inclusive, and innovative workplace where every team member can thrive. Our open office layout encourages communication and idea-sharing across departments.'
  },
  description2: {
    type: String,
    required: [true, 'Second description is required'],
    default: 'We believe in work-life balance and offer flexible scheduling options to accommodate our employees\' needs. Regular team-building activities and social events help strengthen relationships and boost morale.'
  },
  description3: {
    type: String,
    required: [true, 'Third description is required'],
    default: 'Professional development is a priority, with ongoing training opportunities and clear career advancement paths for all employees.'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  imageAlt: {
    type: String,
    default: 'Collaborative work environment'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const WorkEnvironment = mongoose.model('WorkEnvironment', workEnvironmentSchema);

export default WorkEnvironment;