import { PanIndiaPresence } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create or update pan India presence data
// @route   POST /api/pan-india-presence
// @access  Private/Admin
export const createOrUpdatePanIndiaPresence = async (req, res) => {
  try {
    const {
      title,
      description,
      totalStates,
      statesDescription,
      totalCities,
      citiesDescription,
      totalProjects,
      projectsDescription,
      mapImage,
      locations,
      isActive
    } = req.body;

    // Check if pan India presence data already exists
    let panIndiaPresence = await PanIndiaPresence.findOne();

    if (panIndiaPresence) {
      // Update existing record
      panIndiaPresence.title = title || panIndiaPresence.title;
      panIndiaPresence.description = description || panIndiaPresence.description;
      panIndiaPresence.totalStates = totalStates || panIndiaPresence.totalStates;
      panIndiaPresence.statesDescription = statesDescription || panIndiaPresence.statesDescription;
      panIndiaPresence.totalCities = totalCities || panIndiaPresence.totalCities;
      panIndiaPresence.citiesDescription = citiesDescription || panIndiaPresence.citiesDescription;
      panIndiaPresence.totalProjects = totalProjects || panIndiaPresence.totalProjects;
      panIndiaPresence.projectsDescription = projectsDescription || panIndiaPresence.projectsDescription;
      panIndiaPresence.mapImage = mapImage || panIndiaPresence.mapImage;
      
      if (locations && locations.length > 0) {
        panIndiaPresence.locations = locations;
      }
      
      if (isActive !== undefined) {
        panIndiaPresence.isActive = isActive;
      }

      await panIndiaPresence.save();

      return res.status(200).json({
        success: true,
        message: 'Pan India presence data updated successfully',
        data: panIndiaPresence
      });
    } else {
      // Create new record
      panIndiaPresence = await PanIndiaPresence.create({
        title,
        description,
        totalStates,
        statesDescription,
        totalCities,
        citiesDescription,
        totalProjects,
        projectsDescription,
        mapImage,
        locations: locations || [],
        isActive: isActive !== undefined ? isActive : true
      });

      return res.status(201).json({
        success: true,
        message: 'Pan India presence data created successfully',
        data: panIndiaPresence
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get pan India presence data
// @route   GET /api/pan-india-presence
// @access  Public
export const getPanIndiaPresence = async (req, res) => {
  try {
    const panIndiaPresence = await PanIndiaPresence.findOne();

    if (!panIndiaPresence) {
      return res.status(404).json({
        success: false,
        message: 'Pan India presence data not found'
      });
    }

    res.status(200).json({
      success: true,
      data: panIndiaPresence
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add a new location
// @route   POST /api/pan-india-presence/locations
// @access  Private/Admin
export const addLocation = async (req, res) => {
  try {
    const { name, region, coordinates, isActive } = req.body;

    if (!name || !region || !coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, region, and coordinates'
      });
    }

    let panIndiaPresence = await PanIndiaPresence.findOne();

    if (!panIndiaPresence) {
      // Create a new pan India presence record if it doesn't exist
      panIndiaPresence = await PanIndiaPresence.create({
        locations: [{
          name,
          region,
          coordinates,
          isActive: isActive !== undefined ? isActive : true
        }]
      });
    } else {
      // Add new location to existing record
      panIndiaPresence.locations.push({
        name,
        region,
        coordinates,
        isActive: isActive !== undefined ? isActive : true
      });

      await panIndiaPresence.save();
    }

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: panIndiaPresence
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a location
// @route   PUT /api/pan-india-presence/locations/:id
// @access  Private/Admin
export const updateLocation = async (req, res) => {
  try {
    const { name, region, coordinates, isActive } = req.body;
    const locationId = req.params.id;

    const panIndiaPresence = await PanIndiaPresence.findOne();

    if (!panIndiaPresence) {
      return res.status(404).json({
        success: false,
        message: 'Pan India presence data not found'
      });
    }

    // Find the location by ID
    const locationIndex = panIndiaPresence.locations.findIndex(
      location => location._id.toString() === locationId
    );

    if (locationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Update location fields
    if (name) panIndiaPresence.locations[locationIndex].name = name;
    if (region) panIndiaPresence.locations[locationIndex].region = region;
    if (coordinates) panIndiaPresence.locations[locationIndex].coordinates = coordinates;
    if (isActive !== undefined) panIndiaPresence.locations[locationIndex].isActive = isActive;

    await panIndiaPresence.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: panIndiaPresence
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a location
// @route   DELETE /api/pan-india-presence/locations/:id
// @access  Private/Admin
export const deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;

    const panIndiaPresence = await PanIndiaPresence.findOne();

    if (!panIndiaPresence) {
      return res.status(404).json({
        success: false,
        message: 'Pan India presence data not found'
      });
    }

    // Remove the location by ID
    panIndiaPresence.locations = panIndiaPresence.locations.filter(
      location => location._id.toString() !== locationId
    );

    await panIndiaPresence.save();

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully',
      data: panIndiaPresence
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all locations
// @route   GET /api/pan-india-presence/locations
// @access  Public
export const getLocations = async (req, res) => {
  try {
    const panIndiaPresence = await PanIndiaPresence.findOne();

    if (!panIndiaPresence) {
      return res.status(404).json({
        success: false,
        message: 'Pan India presence data not found'
      });
    }

    res.status(200).json({
      success: true,
      count: panIndiaPresence.locations.length,
      data: panIndiaPresence.locations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};