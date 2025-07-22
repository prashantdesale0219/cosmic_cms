import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cosmic_cms',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'cosmic-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRE || '7d',
  
  // Email configuration
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailService: process.env.EMAIL_SERVICE || 'gmail',
  
  // File upload configuration
  uploadDir: process.env.UPLOAD_DIR || '../uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'],
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Pagination defaults
  defaultPageSize: 10,
  maxPageSize: 100
};

export default config;