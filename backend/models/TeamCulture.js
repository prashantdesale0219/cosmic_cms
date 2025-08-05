import mongoose from 'mongoose';

const teamCultureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Our Team Culture'
  },
  description: {
    type: String,
    required: true,
    default: 'At SS Tech, we foster a culture of innovation, collaboration, and celebration. We believe that recognizing achievements and creating opportunities for team bonding are essential for maintaining a motivated and engaged workforce.'
  },
  secondDescription: {
    type: String,
    required: true,
    default: 'Our regular team events, celebrations, and recognition programs help build camaraderie, boost morale, and create a positive work environment where everyone feels valued and appreciated.'
  },
  image: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80'
  },
  stats: {
    annualEvents: {
      count: {
        type: String,
        default: '15+'
      },
      label: {
        type: String,
        default: 'Annual Events'
      }
    },
    employeeSatisfaction: {
      count: {
        type: String,
        default: '90%'
      },
      label: {
        type: String,
        default: 'Employee Satisfaction'
      }
    },
    industryAwards: {
      count: {
        type: String,
        default: '12+'
      },
      label: {
        type: String,
        default: 'Industry Awards'
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TeamCulture', teamCultureSchema);