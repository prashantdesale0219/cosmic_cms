const configService = require('../services/configService');

/**
 * Get company profile data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCompanyData = async (req, res) => {
  try {
    const companyData = configService.getCompanyData();
    
    return res.status(200).json({
      success: true,
      data: companyData
    });
  } catch (error) {
    console.error('Error in getCompanyData controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching company data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get specific section of company profile data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSection = async (req, res) => {
  try {
    const { section } = req.params;
    
    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'Section parameter is required'
      });
    }
    
    const sectionData = configService.getSection(section);
    
    return res.status(200).json({
      success: true,
      data: sectionData
    });
  } catch (error) {
    console.error(`Error in getSection controller for section ${req.params.section}:`, error);
    
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching section data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get offerings for a specific customer type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOfferings = async (req, res) => {
  try {
    const { customerType } = req.params;
    
    if (!customerType) {
      return res.status(400).json({
        success: false,
        message: 'Customer type parameter is required'
      });
    }
    
    const offerings = configService.getOfferings(customerType);
    
    return res.status(200).json({
      success: true,
      data: offerings
    });
  } catch (error) {
    console.error(`Error in getOfferings controller for customer type ${req.params.customerType}:`, error);
    
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching offerings data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get subsidy information for a specific customer type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSubsidyInfo = async (req, res) => {
  try {
    const { customerType } = req.params;
    
    if (!customerType) {
      return res.status(400).json({
        success: false,
        message: 'Customer type parameter is required'
      });
    }
    
    const subsidyInfo = configService.getSubsidyInfo(customerType);
    
    return res.status(200).json({
      success: true,
      data: subsidyInfo
    });
  } catch (error) {
    console.error(`Error in getSubsidyInfo controller for customer type ${req.params.customerType}:`, error);
    
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching subsidy information',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get ROI calculator data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getROICalculatorData = async (req, res) => {
  try {
    const roiData = configService.getROICalculatorData();
    
    return res.status(200).json({
      success: true,
      data: roiData
    });
  } catch (error) {
    console.error('Error in getROICalculatorData controller:', error);
    
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error fetching ROI calculator data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};