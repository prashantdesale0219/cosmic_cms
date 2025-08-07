import mongoose from 'mongoose';

const headerSchema = new mongoose.Schema({
  // Top Bar Information
  topBar: {
    isVisible: {
      type: Boolean,
      default: true
    },
    address: {
      type: String,
      default: 'No. 56 A, Baltimore 4508'
    },
    email: {
      type: String,
      default: 'info@example.com'
    },
    socialText: {
      type: String,
      default: 'We are Social :'
    },
    socialLinks: [{
      platform: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      }
    }]
  },
  
  // Logo Configuration
  logo: {
    url: {
      type: String,
      default: '/logo.png'
    },
    alt: {
      type: String,
      default: 'Cosmic Solar'
    },
    width: {
      type: Number,
      default: 150
    },
    height: {
      type: Number,
      default: 50
    }
  },
  
  // Navigation Menu
  navigation: [{
    label: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: false,
      default: '#'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    submenu: [{
      label: {
        type: String,
        required: true
      },
      href: {
        type: String,
        required: false,
        default: '#'
      },
      order: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  }],
  
  // Header Settings
  settings: {
    isSticky: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    showTopBar: {
      type: Boolean,
      default: true
    }
  },
  
  // Meta Information
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to update the updatedAt field
headerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create default header data if none exists
headerSchema.statics.createDefault = async function() {
  const existingHeader = await this.findOne();
  if (!existingHeader) {
    const defaultHeader = new this({
      topBar: {
        isVisible: true,
        address: 'No. 56 A, Baltimore 4508',
        email: 'info@example.com',
        socialText: 'We are Social :',
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com', icon: 'lab la-facebook-f' },
          { platform: 'Twitter', url: 'https://twitter.com', icon: 'lab la-twitter' },
          { platform: 'Instagram', url: 'https://instagram.com', icon: 'lab la-instagram' }
        ]
      },
      logo: {
        url: '/logo.png',
        alt: 'Cosmic Solar',
        width: 150,
        height: 50
      },
      navigation: [
        { label: 'Home', href: '/', order: 1, isActive: true },
        { 
          label: 'About', 
          href: '/about', 
          order: 2, 
          isActive: true,
          submenu: [
            { label: "Director's Desk", href: '/director-desk', order: 1, isActive: true },
            { label: 'Company Culture', href: '/company-culture', order: 2, isActive: true },
            { label: 'Team Celebration', href: '/team-celebration', order: 3, isActive: true }
          ]
        },
        { 
          label: 'Products', 
          href: '/products', 
          order: 3, 
          isActive: true,
          submenu: [
            { label: 'Solar Panels', href: '/products/solar-panels', order: 1, isActive: true },
            { label: 'Inverters & Batteries', href: '/products/inverters-batteries', order: 2, isActive: true },
            { label: 'Accessories', href: '/products/accessories', order: 3, isActive: true }
          ]
        },
        { label: 'Services', href: '/services', order: 4, isActive: true },
        { label: 'Projects', href: '/projects', order: 5, isActive: true },
        { label: 'Calculator', href: '/calculator', order: 6, isActive: true },
        { 
          label: 'Media', 
          href: '/blog', 
          order: 7, 
          isActive: true,
          submenu: [
            { label: 'Blog', href: '/blog', order: 1, isActive: true },
            { label: 'All Posts', href: '/blog/all', order: 2, isActive: true },
            { label: 'News', href: '/blog?category=news', order: 3, isActive: true },
            { label: 'Press Releases', href: '/pr', order: 4, isActive: true },
            { label: 'Awards and Achievements', href: '/achievements-awards', order: 5, isActive: true }
          ]
        },
        { label: 'Contact', href: '/contact', order: 8, isActive: true }
      ],
      settings: {
        isSticky: true,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        showTopBar: true
      }
    });
    await defaultHeader.save();
    return defaultHeader;
  }
  return existingHeader;
};

const Header = mongoose.model('Header', headerSchema);

export default Header;