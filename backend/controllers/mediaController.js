import { Media } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';
import path from 'path';
import config from '../config/config.js';
import fs from 'fs';

/**
 * @desc    Create a new media item
 * @route   POST /api/media
 * @access  Private
 */
export const createMedia = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    const mediaItems = [];

    // Process each uploaded file
    for (const file of req.files) {
      // Determine file type based on mimetype
      let type = 'other';
      if (file.mimetype.startsWith('image/')) {
        type = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        type = 'video';
      } else if (file.mimetype.startsWith('audio/')) {
        type = 'audio';
      } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document') || file.mimetype.includes('text/')) {
        type = 'document';
      }

      // Construct the file URL
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      // Normalize path separators and extract the relative path
      const normalizedPath = file.path.replace(/\\/g, '/');
      let relativePath = '';
      
      if (normalizedPath.includes('uploads/')) {
        relativePath = normalizedPath.split('uploads/')[1];
      } else if (normalizedPath.includes('uploads\\')) {
        relativePath = normalizedPath.split('uploads\\')[1];
      } else {
        // Fallback if the expected pattern isn't found
        const pathParts = normalizedPath.split('/');
        const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
        if (uploadsIndex !== -1) {
          relativePath = pathParts.slice(uploadsIndex + 1).join('/');
        } else {
          // If all else fails, use the filename
          relativePath = file.filename;
        }
      }
      
      // Ensure relativePath doesn't have any backslashes
      relativePath = relativePath.replace(/\\/g, '/');
      
      // Construct URL with forward slashes
      const url = `/uploads/${relativePath}`;
      
      // Ensure baseUrl doesn't have a trailing slash before adding the url
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const fullUrl = `${cleanBaseUrl}${url}`;
      
      console.log('File path:', file.path);
      console.log('Normalized path:', normalizedPath);
      console.log('Relative path:', relativePath);
      console.log('URL:', url);
      console.log('Full URL:', fullUrl);

      // Create media item
      const mediaItem = await Media.create({
        name: file.filename,
        originalName: file.originalname,
        type,
        mimeType: file.mimetype,
        size: file.size,
        url,
        fullUrl,
        path: file.path,
        uploadedBy: req.user ? req.user._id : null,
        folder: relativePath.split('/')[0] // Use the first folder as the category
      });

      mediaItems.push(mediaItem);
    }

    res.status(201).json({
      success: true,
      count: mediaItems.length,
      data: mediaItems
    });
  } catch (error) {
    console.error('Error in createMedia:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all media items with filtering, sorting, etc.
 * @route   GET /api/media
 * @access  Private
 */
export const getAllMedia = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Media.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const media = await features.query.populate('uploadedBy', 'name email');

    // Get total count for pagination
    const totalCount = await Media.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: media.length,
      totalCount,
      pagination: features.pagination,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get public media items
 * @route   GET /api/media/public
 * @access  Public
 */
export const getPublicMedia = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Media.find({ isPublic: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const media = await features.query;

    // Get total count for pagination
    const totalCount = await Media.countDocuments({ isPublic: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: media.length,
      totalCount,
      pagination: features.pagination,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get media by type
 * @route   GET /api/media/type/:type
 * @access  Private
 */
export const getMediaByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type
    const validTypes = ['image', 'video', 'document', 'audio', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid media type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    const features = new APIFeatures(Media.find({ type }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const media = await features.query.populate('uploadedBy', 'name email');

    // Get total count for pagination
    const totalCount = await Media.countDocuments({ type, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: media.length,
      totalCount,
      pagination: features.pagination,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get media by folder
 * @route   GET /api/media/folder/:folder
 * @access  Private
 */
export const getMediaByFolder = async (req, res) => {
  try {
    const { folder } = req.params;

    const features = new APIFeatures(Media.find({ folder }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const media = await features.query.populate('uploadedBy', 'name email');

    // Get total count for pagination
    const totalCount = await Media.countDocuments({ folder, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: media.length,
      totalCount,
      pagination: features.pagination,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single media item by ID
 * @route   GET /api/media/:id
 * @access  Private
 */
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a media item
 * @route   PUT /api/media/:id
 * @access  Private
 */
export const updateMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a media item
 * @route   DELETE /api/media/:id
 * @access  Private
 */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete the actual file from storage
    if (media.path && fs.existsSync(media.path)) {
      try {
        fs.unlinkSync(media.path);
        console.log(`File deleted successfully: ${media.path}`);
      } catch (err) {
        console.error(`Error deleting file ${media.path}:`, err);
        // Continue with the response even if file deletion fails
      }
    } else {
      console.log(`File not found or path is invalid: ${media.path}`);
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Bulk delete media items
 * @route   DELETE /api/media/bulk
 * @access  Private/Admin
 */
export const bulkDeleteMedia = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of media IDs to delete'
      });
    }

    // First find all media items to get their file paths
    const mediaItems = await Media.find({ _id: { $in: ids } });
    
    // Delete the media documents from the database
    const result = await Media.deleteMany({ _id: { $in: ids } });

    // Delete the actual files from storage
    let deletedFiles = 0;
    let failedFiles = 0;
    
    for (const media of mediaItems) {
      if (media.path && fs.existsSync(media.path)) {
        try {
          fs.unlinkSync(media.path);
          console.log(`File deleted successfully: ${media.path}`);
          deletedFiles++;
        } catch (err) {
          console.error(`Error deleting file ${media.path}:`, err);
          failedFiles++;
        }
      } else {
        console.log(`File not found or path is invalid: ${media.path}`);
        failedFiles++;
      }
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} media items deleted from database. Files: ${deletedFiles} deleted, ${failedFiles} failed.`,
      data: {}
    });
  } catch (error) {
    console.error('Error in bulkDeleteMedia:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update media tags
 * @route   PUT /api/media/:id/tags
 * @access  Private
 */
export const updateMediaTags = async (req, res) => {
  try {
    const { tags } = req.body;

    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of tags'
      });
    }

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { tags },
      { new: true }
    ).populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all unique media folders
 * @route   GET /api/media/folders
 * @access  Private
 */
export const getMediaFolders = async (req, res) => {
  try {
    const folders = await Media.distinct('folder');

    res.status(200).json({
      success: true,
      count: folders.length,
      data: folders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};