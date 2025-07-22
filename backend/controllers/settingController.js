import { Setting } from '../models/index.js';

/**
 * @desc    Get all settings
 * @route   GET /api/settings
 * @access  Private/Admin
 */
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();

    // If no settings exist, create default settings
    if (settings.length === 0) {
      const defaultSettings = await Setting.create({
        siteTitle: 'Cosmic Energy Solutions',
        tagline: 'Powering a Sustainable Future',
        contactEmail: 'info@cosmicenergy.com',
        contactPhone: '+1 (123) 456-7890',
        address: '123 Solar Street, Green City, CA 94123',
        socialMedia: {
          facebook: 'https://facebook.com/cosmicenergy',
          twitter: 'https://twitter.com/cosmicenergy',
          instagram: 'https://instagram.com/cosmicenergy',
          linkedin: 'https://linkedin.com/company/cosmicenergy'
        },
        metaTitle: 'Cosmic Energy Solutions - Renewable Energy Experts',
        metaDescription: 'Cosmic Energy Solutions provides solar and renewable energy solutions for residential and commercial properties.',
        footerText: '© ' + new Date().getFullYear() + ' Cosmic Energy Solutions. All rights reserved.'
      });

      return res.status(200).json({
        success: true,
        data: defaultSettings
      });
    }

    res.status(200).json({
      success: true,
      data: settings[0] // Return the first settings object
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get public settings
 * @route   GET /api/settings/public
 * @access  Public
 */
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.find().select(
      'siteTitle tagline logo favicon contactEmail contactPhone address socialMedia metaTitle metaDescription footerText maintenanceMode maintenanceMessage'
    );

    // If no settings exist, create default settings
    if (settings.length === 0) {
      const defaultSettings = await Setting.create({
        siteTitle: 'Cosmic Energy Solutions',
        tagline: 'Powering a Sustainable Future',
        contactEmail: 'info@cosmicenergy.com',
        contactPhone: '+1 (123) 456-7890',
        address: '123 Solar Street, Green City, CA 94123',
        socialMedia: {
          facebook: 'https://facebook.com/cosmicenergy',
          twitter: 'https://twitter.com/cosmicenergy',
          instagram: 'https://instagram.com/cosmicenergy',
          linkedin: 'https://linkedin.com/company/cosmicenergy'
        },
        metaTitle: 'Cosmic Energy Solutions - Renewable Energy Experts',
        metaDescription: 'Cosmic Energy Solutions provides solar and renewable energy solutions for residential and commercial properties.',
        footerText: '© ' + new Date().getFullYear() + ' Cosmic Energy Solutions. All rights reserved.'
      });

      return res.status(200).json({
        success: true,
        data: defaultSettings
      });
    }

    res.status(200).json({
      success: true,
      data: settings[0] // Return the first settings object
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Submit public settings
 * @route   POST /api/settings/public
 * @access  Public
 */
export const submitPublicSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create(req.body);
      return res.status(201).json({
        success: true,
        data: settings,
        message: 'Settings created successfully'
      });
    }
    
    // Update existing settings with the data from request body
    settings = await Setting.findByIdAndUpdate(
      settings._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    // Return the updated settings object
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update settings
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      // Update existing settings
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update maintenance mode
 * @route   PUT /api/settings/maintenance
 * @access  Private/Admin
 */
export const updateMaintenanceMode = async (req, res) => {
  try {
    const { maintenanceMode, maintenanceMessage } = req.body;

    if (typeof maintenanceMode !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'maintenanceMode must be a boolean value'
      });
    }

    let settings = await Setting.findOne();

    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create({
        maintenanceMode,
        maintenanceMessage: maintenanceMessage || 'Site is under maintenance. Please check back later.'
      });
    } else {
      // Update existing settings
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        {
          maintenanceMode,
          maintenanceMessage: maintenanceMessage || settings.maintenanceMessage || 'Site is under maintenance. Please check back later.'
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update social media links
 * @route   PUT /api/settings/social-media
 * @access  Private/Admin
 */
export const updateSocialMedia = async (req, res) => {
  try {
    const { socialMedia } = req.body;

    if (!socialMedia || typeof socialMedia !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'socialMedia must be an object'
      });
    }

    let settings = await Setting.findOne();

    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create({
        socialMedia
      });
    } else {
      // Update existing settings
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        { socialMedia },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update SEO settings
 * @route   PUT /api/settings/seo
 * @access  Private/Admin
 */
export const updateSeoSettings = async (req, res) => {
  try {
    const { metaTitle, metaDescription, googleAnalyticsId } = req.body;

    let settings = await Setting.findOne();

    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create({
        metaTitle,
        metaDescription,
        googleAnalyticsId
      });
    } else {
      // Update existing settings
      const updateData = {};
      if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
      if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
      if (googleAnalyticsId !== undefined) updateData.googleAnalyticsId = googleAnalyticsId;

      settings = await Setting.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update contact information
 * @route   PUT /api/settings/contact
 * @access  Private/Admin
 */
export const updateContactInfo = async (req, res) => {
  try {
    const { contactEmail, contactPhone, address } = req.body;

    let settings = await Setting.findOne();

    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create({
        contactEmail,
        contactPhone,
        address
      });
    } else {
      // Update existing settings
      const updateData = {};
      if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
      if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
      if (address !== undefined) updateData.address = address;

      settings = await Setting.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update scripts (header/footer)
 * @route   PUT /api/settings/scripts
 * @access  Private/Admin
 */
export const updateScripts = async (req, res) => {
  try {
    const { headerScripts, footerScripts } = req.body;

    let settings = await Setting.findOne();

    // If no settings exist, create new settings
    if (!settings) {
      settings = await Setting.create({
        headerScripts,
        footerScripts
      });
    } else {
      // Update existing settings
      const updateData = {};
      if (headerScripts !== undefined) updateData.headerScripts = headerScripts;
      if (footerScripts !== undefined) updateData.footerScripts = footerScripts;

      settings = await Setting.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};