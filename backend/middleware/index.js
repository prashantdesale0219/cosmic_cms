// Export all middleware from a single file for easier imports

export { protect, admin, editorOrAdmin } from './authMiddleware.js';
export { notFound, errorHandler } from './errorMiddleware.js';
export { uploadSingle, uploadMultiple, uploadFields, handleUploadError } from './uploadMiddleware.js';