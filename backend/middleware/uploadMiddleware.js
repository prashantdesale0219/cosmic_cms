import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/config.js';

// Create upload directory if it doesn't exist
const createUploadDir = (dir) => {
  console.log(`Checking if directory exists: ${dir}`);
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created successfully: ${dir}`);
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
      throw new Error(`Could not create upload directory: ${error.message}`);
    }
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
};

// Ensure base upload directory exists
const ensureBaseUploadDir = () => {
  const uploadDir = path.resolve(process.cwd(), config.uploadDir);
  console.log(`Base upload directory: ${uploadDir}`);
  createUploadDir(uploadDir);
  return uploadDir;
};

// Initialize base upload directory
const baseUploadDir = ensureBaseUploadDir();
console.log(`Base upload directory initialized: ${baseUploadDir}`);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(process.cwd(), config.uploadDir);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    // Create year/month based folders
    const yearMonthDir = path.join(uploadDir, `${year}/${month}`);
    console.log(`Year/Month directory: ${yearMonthDir}`);
    createUploadDir(yearMonthDir);
    
    cb(null, yearMonthDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log(`Checking file type: ${file.mimetype}`);
  // Check if file type is allowed
  if (config.allowedFileTypes.includes(file.mimetype)) {
    console.log(`File type allowed: ${file.mimetype}`);
    cb(null, true);
  } else {
    console.log(`File type not allowed: ${file.mimetype}`);
    cb(new Error(`File type not allowed. Allowed types: ${config.allowedFileTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize
  },
  fileFilter
});

console.log('Multer configured with the following settings:');
console.log(`- Max file size: ${config.maxFileSize / (1024 * 1024)}MB`);
console.log(`- Allowed file types: ${config.allowedFileTypes.join(', ')}`);

// Middleware for handling file uploads
export const uploadSingle = (fieldName) => {
  console.log(`Setting up single file upload for field: ${fieldName}`);
  return upload.single(fieldName);
};

export const uploadMultiple = (fieldName, maxCount) => {
  console.log(`Setting up multiple file upload for field: ${fieldName}, max count: ${maxCount || 10}`);
  return upload.array(fieldName, maxCount || 10);
};

export const uploadFields = (fields) => {
  console.log(`Setting up fields upload: ${JSON.stringify(fields)}`);
  return upload.fields(fields);
};

// Error handling for multer
export const handleUploadError = (err, req, res, next) => {
  console.log('Upload error handler called');
  if (err) {
    console.error('Upload error:', err);
  }
  
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${config.maxFileSize / (1024 * 1024)}MB`
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};