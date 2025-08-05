import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PhotoIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Loader from './Loader';

const ImageUpload = ({ currentImage, onImageUpload, folder = 'uploads' }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const { token } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      // Upload image
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      const imageUrl = data.url;

      // Update preview and call parent callback
      setPreviewUrl(imageUrl);
      onImageUpload(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
  };

  return (
    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
      {uploading ? (
        <div className="text-center">
          <Loader size="small" />
          <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
        </div>
      ) : previewUrl ? (
        <div className="text-center w-full">
          <div className="relative w-full max-w-xs mx-auto">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-48 object-contain rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <label
            htmlFor={`file-upload-${folder}`}
            className="mt-4 cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
            Change Image
            <input
              id={`file-upload-${folder}`}
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-1 text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`file-upload-${folder}`}
              className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
            >
              <span>Upload an image</span>
              <input
                id={`file-upload-${folder}`}
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;