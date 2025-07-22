import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: [true, 'Site title is required'],
    trim: true
  },
  tagline: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    required: [true, 'Logo is required']
  },
  favicon: {
    type: String
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  googleAnalyticsId: {
    type: String,
    trim: true
  },
  footerText: {
    type: String,
    trim: true
  },
  headerScripts: {
    type: String
  },
  footerScripts: {
    type: String
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently performing maintenance. Please check back soon.'
  }
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;