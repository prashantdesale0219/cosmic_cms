import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required (North/South/East/West/Central)'],
    enum: ['North India', 'South India', 'East India', 'West India', 'Central India'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const panIndiaPresenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Pan India Presence'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    default: 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.'
  },
  totalStates: {
    type: Number,
    required: [true, 'Total states count is required'],
    default: 25
  },
  statesDescription: {
    type: String,
    required: [true, 'States description is required'],
    default: 'Serving customers across more than 25 states with dedicated local support teams.'
  },
  totalCities: {
    type: Number,
    required: [true, 'Total cities count is required'],
    default: 100
  },
  citiesDescription: {
    type: String,
    required: [true, 'Cities description is required'],
    default: 'Operating in over 100 cities with installation and maintenance capabilities.'
  },
  totalProjects: {
    type: Number,
    required: [true, 'Total projects count is required'],
    default: 1000
  },
  projectsDescription: {
    type: String,
    required: [true, 'Projects description is required'],
    default: 'Successfully completed over 1000 solar installations of various scales nationwide.'
  },
  mapImage: {
    type: String,
    default: '/mapindea.png'
  },
  locations: [locationSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const PanIndiaPresence = mongoose.model('PanIndiaPresence', panIndiaPresenceSchema);

export default PanIndiaPresence;