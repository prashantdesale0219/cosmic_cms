import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MediaUpload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (selectedFiles) => {
    // Filter out files that exceed size limit (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const validFiles = selectedFiles.filter(file => file.size <= maxSize);
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(`${oversizedFiles.length} file(s) exceed the 10MB size limit and were not added`);
    }

    // Add preview URLs for valid files
    const newFiles = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 11),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.id !== id);
      
      // Revoke object URL to avoid memory leaks
      const fileToRemove = prevFiles.find(file => file.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      return updatedFiles;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('bg-primary-50');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-primary-50');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-primary-50');
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.startsWith('video/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.startsWith('audio/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else if (type.startsWith('application/pdf')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.includes('zip') || type.includes('compressed') || type.includes('archive')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      files.forEach(fileObj => {
        formData.append('files', fileObj.file);
      });

      const response = await mediaService.uploadMedia(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      if (response.data && response.data.success) {
        toast.success(`${files.length > 1 ? `${files.length} files` : 'File'} uploaded successfully`);
        
        // Clean up object URLs
        files.forEach(fileObj => {
          if (fileObj.preview) {
            URL.revokeObjectURL(fileObj.preview);
          }
        });
        
        // Navigate to media library
        navigate('/media');
      } else {
        toast.error(response.data?.message || 'Failed to upload files');
      }
    } catch (err) {
      console.error('Media upload error:', err);
      toast.error('An error occurred while uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Media</h1>
          <button
            type="button"
            onClick={() => navigate('/media')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Media Library
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div
                ref={dropAreaRef}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md transition-colors duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, PDF, MP4, MP3, ZIP up to 10MB
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Selected Files ({files.length})</h3>
                  <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {files.map((file) => (
                      <li key={file.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                        <div className="w-full flex items-center justify-between p-4">
                          <div className="flex-1 flex items-center truncate">
                            <div className="flex-shrink-0">
                              {file.preview ? (
                                <img src={file.preview} alt={file.name} className="h-12 w-12 object-cover rounded" />
                              ) : (
                                getFileIcon(file.type)
                              )}
                            </div>
                            <div className="flex-1 px-4 truncate">
                              <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    // Clean up object URLs
                    files.forEach(fileObj => {
                      if (fileObj.preview) {
                        URL.revokeObjectURL(fileObj.preview);
                      }
                    });
                  }}
                  className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={files.length === 0 || isUploading}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={files.length === 0 || isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading ({uploadProgress}%)
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                      Upload {files.length > 0 ? `(${files.length} ${files.length === 1 ? 'file' : 'files'})` : ''}
                    </>
                  )}
                </button>
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary-600">
                          Upload Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary-600">
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;