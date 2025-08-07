import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  // Company Information
  companyInfo: {
    logo: {
      url: {
        type: String,
        default: '/logo.png'
      },
      alt: {
        type: String,
        default: 'Cosmic Solar'
      }
    },
    description: {
      type: String,
      default: 'Empowering homes and businesses with sustainable solar solutions. Join us in creating a greener future with clean, renewable energy.'
    },
    address: {
      type: String,
      default: '123 Solar Street, Green City, 12345'
    },
    phone: {
      type: String,
      default: '+1 (555) 123-4567'
    },
    email: {
      type: String,
      default: 'info@cosmicsolar.com'
    }
  },
  
  // Footer Sections/Links
  sections: [{
    title: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    links: [{
      name: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      },
      openInNewTab: {
        type: Boolean,
        default: false
      }
    }]
  }],
  
  // Social Media Links
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
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Newsletter Section
  newsletter: {
    isVisible: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Stay Updated'
    },
    description: {
      type: String,
      default: 'Subscribe to our newsletter for the latest updates on solar technology and exclusive offers.'
    },
    placeholder: {
      type: String,
      default: 'Enter your email address'
    },
    buttonText: {
      type: String,
      default: 'Subscribe'
    }
  },
  
  // Copyright Information
  copyright: {
    text: {
      type: String,
      default: '© 2024 Cosmic Solar. All rights reserved.'
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    companyName: {
      type: String,
      default: 'Cosmic Solar'
    }
  },
  
  // Footer Design Settings
  design: {
    backgroundColor: {
      type: String,
      default: '#1a365d'
    },
    textColor: {
      type: String,
      default: '#ffffff'
    },
    accentColor: {
      type: String,
      default: '#fbbf24'
    },
    backgroundImage: {
      type: String,
      default: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-footer-bg-layer-1.png'
    },
    showDecorations: {
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
footerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create default footer data if none exists
footerSchema.statics.createDefault = async function() {
  const existingFooter = await this.findOne();
  if (!existingFooter) {
    const defaultFooter = new this({
      companyInfo: {
        logo: {
          url: '/logo.png',
          alt: 'Cosmic Solar'
        },
        description: 'Empowering homes and businesses with sustainable solar solutions. Join us in creating a greener future with clean, renewable energy.',
        address: '123 Solar Street, Green City, 12345',
        phone: '+1 (555) 123-4567',
        email: 'info@cosmicsolar.com'
      },
      sections: [
        {
          title: 'Products',
          order: 1,
          isActive: true,
          links: [
            { name: 'Solar Panels', path: '/products#panels', order: 1, isActive: true },
            { name: 'Inverters & Batteries', path: '/products#inverters', order: 2, isActive: true },
            { name: 'Accessories', path: '/products#accessories', order: 3, isActive: true }
          ]
        },
        {
          title: 'Solutions',
          order: 2,
          isActive: true,
          links: [
            { name: 'Residential', path: '/solutions#residential', order: 1, isActive: true },
            { name: 'Commercial', path: '/solutions#commercial', order: 2, isActive: true },
            { name: 'Solar Calculator', path: '/calculator', order: 3, isActive: true }
          ]
        },
        {
          title: 'Company',
          order: 3,
          isActive: true,
          links: [
            { name: 'About Us', path: '/about', order: 1, isActive: true },
            { name: 'Customer Stories', path: '/customer-stories', order: 2, isActive: true },
            { name: 'Partner With Us', path: '/partner', order: 3, isActive: true },
            { name: 'Contact Us', path: '/contact', order: 4, isActive: true }
          ]
        },
        {
          title: 'Resources',
          order: 4,
          isActive: true,
          links: [
            { name: 'Blog', path: '/resources#blog', order: 1, isActive: true },
            { name: 'Photo Gallery', path: '/resources#gallery', order: 2, isActive: true },
            { name: 'Newsletter', path: '/resources#newsletter', order: 3, isActive: true }
          ]
        }
      ],
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com', icon: 'FaFacebookF', order: 1, isActive: true },
        { platform: 'Twitter', url: 'https://twitter.com', icon: 'FaTwitter', order: 2, isActive: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'FaLinkedinIn', order: 3, isActive: true },
        { platform: 'Instagram', url: 'https://instagram.com', icon: 'FaInstagram', order: 4, isActive: true }
      ],
      newsletter: {
        isVisible: true,
        title: 'Stay Updated',
        description: 'Subscribe to our newsletter for the latest updates on solar technology and exclusive offers.',
        placeholder: 'Enter your email address',
        buttonText: 'Subscribe'
      },
      copyright: {
        text: '© 2024 Cosmic Solar. All rights reserved.',
        year: new Date().getFullYear(),
        companyName: 'Cosmic Solar'
      },
      design: {
        backgroundColor: '#1a365d',
        textColor: '#ffffff',
        accentColor: '#fbbf24',
        backgroundImage: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-footer-bg-layer-1.png',
        showDecorations: true
      }
    });
    await defaultFooter.save();
    return defaultFooter;
  }
  return existingFooter;
};

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;