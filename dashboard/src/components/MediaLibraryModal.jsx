import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { mediaService } from '../services/api';
import { toast } from 'react-hot-toast';
import '../pages/products/MediaLibrary.css';

// Set app element for accessibility
Modal.setAppElement('#root');

const MediaLibraryModal = ({ isOpen, onClose, onSelect, mediaType }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMediaFiles(1);
    }
  }, [isOpen]);

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
      console.log('Fetching media files, page:', page);
      const response = await mediaService.getMedia(page, 12);
      console.log('Media fetch response:', response);
      
      // Check if response exists and handle different response formats
      if (response) {
        let mediaData = [];
        
        // Handle different response structures
        if (response.success && response.data && response.data.data) {
          // Format: { success: true, data: { data: [...] } }
          mediaData = response.data.data || [];
        } else if (response.success && Array.isArray(response.data)) {
          // Format: { success: true, data: [...] }
          mediaData = response.data;
        } else if (response.data && Array.isArray(response.data)) {
          // Format: { data: [...] }
          mediaData = response.data;
        } else if (response.data && response.data.media && Array.isArray(response.data.media)) {
          // Format: { data: { media: [...] } }
          mediaData = response.data.media;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Format: { data: { data: [...] } }
          mediaData = response.data.data;
        }
        
        console.log('Media data:', mediaData);
        
        // Ensure each media item has a valid URL
        const processedMedia = mediaData.map(media => {
          console.log('Processing media item:', media);
          
          // Handle different media object structures
          let url = '';
          
          // Try to extract URL from various possible structures
          if (media.url) {
            url = media.url;
          } else if (media.path) {
            url = media.path;
          } else if (media.file && media.file.url) {
            url = media.file.url;
          } else if (media.file && media.file.path) {
            url = media.file.path;
          } else if (media.src) {
            url = media.src;
          } else if (media.source) {
            url = media.source;
          } else if (media.link) {
            url = media.link;
          } else if (typeof media === 'string') {
            url = media;
          }
          
          console.log('Extracted URL:', url);
          
          // Create a new object with the extracted URL
          const processedItem = {
            ...media,
            url: url
          };
          
          // Make sure fullUrl is set, or construct it from url if needed
          if (!processedItem.fullUrl && processedItem.url) {
            // If url is a relative path, convert to absolute
            if (processedItem.url.startsWith('/')) {
              // Use window.location.origin to ensure we use the current domain
              const frontendBaseUrl = window.location.origin;
              const backendBaseUrl = 'http://localhost:5000';
              
              // Set fullUrl to frontend URL
              processedItem.fullUrl = `${frontendBaseUrl}${processedItem.url}`;
              // Also store the backend URL as a backup
              processedItem.backendUrl = `${backendBaseUrl}${processedItem.url}`;
              
              console.log('Created URLs for relative path:', {
                frontend: processedItem.fullUrl,
                backend: processedItem.backendUrl
              });
            } else if (!processedItem.url.startsWith('http')) {
              // If it's not an absolute URL already, assume it's relative to backend
              const frontendBaseUrl = window.location.origin;
              const backendBaseUrl = 'http://localhost:5000';
              
              // Set fullUrl to frontend URL
              processedItem.fullUrl = `${frontendBaseUrl}${processedItem.url.startsWith('/') ? '' : '/'}${processedItem.url}`;
              // Also store the backend URL as a backup
              processedItem.backendUrl = `${backendBaseUrl}${processedItem.url.startsWith('/') ? '' : '/'}${processedItem.url}`;
              
              console.log('Created URLs for non-http path:', {
                frontend: processedItem.fullUrl,
                backend: processedItem.backendUrl
              });
            } else {
              processedItem.fullUrl = processedItem.url;
              console.log('Using existing URL as fullUrl:', processedItem.fullUrl);
            }
          } else if (processedItem.fullUrl) {
            // If fullUrl exists but might be using the wrong origin
            if (processedItem.fullUrl.includes('/uploads/')) {
              const uploadPath = processedItem.fullUrl.split('/uploads/')[1];
              processedItem.backendUrl = `http://localhost:5000/uploads/${uploadPath}`;
              console.log('Created backup URL from existing fullUrl:', processedItem.backendUrl);
            }
            console.log('Using existing fullUrl:', processedItem.fullUrl);
          } else {
            console.warn('Media item has no URL:', processedItem);
          }
          return processedItem;
        });
        
        setMediaFiles(processedMedia);
        setTotalMediaPages(response.data.totalPages || Math.ceil((response.data.totalCount || 0) / 12) || 1);
        setMediaPage(response.data.currentPage || page);
        
        if (processedMedia.length === 0) {
          toast.info('No media files found');
        }
      } else {
        const errorMsg = response?.message || 'Failed to load media files';
        console.error('Media fetch error:', errorMsg);
        toast.error(errorMsg);
        // Set empty media files as fallback
        setMediaFiles([]);
        setTotalMediaPages(1);
        setMediaPage(1);
      }
    } catch (err) {
      console.error('Media fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load media files';
      toast.error(errorMessage);
      // Set empty media files as fallback
      setMediaFiles([]);
      setTotalMediaPages(1);
      setMediaPage(1);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleMediaPageChange = (page) => {
    if (page < 1 || page > totalMediaPages) return;
    setMediaPage(page);
    fetchMediaFiles(page);
  };

  const handleMediaSelect = (media) => {
    console.log('Selected media:', media);
    
    // Validate that media has a URL before selecting
    if (!media.url && !media.fullUrl && !media.backendUrl && !media.path && 
        !(media.file && media.file.url) && 
        !(media.formats && media.formats.thumbnail && media.formats.thumbnail.url)) {
      console.error('Selected media has no URL:', media);
      toast.error('Selected media has no URL');
      return;
    }
    
    // Pass the entire media object to the parent component
    onSelect(media);
    onClose();
    toast.success('Media selected successfully');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="media-library-modal"
      overlayClassName="media-library-overlay"
    >
      <div className="media-library-container">
        <div className="media-library-header">
          <h2>Media Library {mediaType ? `- Select ${mediaType}` : ''}</h2>
          <button 
            className="close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="media-files-container">
          {isLoadingMedia ? (
            <div className="loading-indicator">Loading media...</div>
          ) : (
            <>
              {mediaFiles && mediaFiles.length > 0 ? (
                <div className="media-grid">
                  {mediaFiles.map((media) => (
                    <div 
                      key={media._id} 
                      className="media-item"
                      onClick={() => handleMediaSelect(media)}
                    >
                      <img 
                        src={media.backendUrl || media.fullUrl || media.url} 
                        alt={media.originalName || media.name || 'Media'} 
                        className="media-thumbnail"
                        onError={(e) => {
                          const originalUrl = e.target.src;
                          console.log('Image failed to load in MediaLibraryModal:', originalUrl);
                          
                          // Try different URLs in sequence
                          if (originalUrl === (media.backendUrl || '')) {
                            // If backendUrl failed, try fullUrl
                            if (media.fullUrl) {
                              console.log('Trying fullUrl in MediaLibraryModal:', media.fullUrl);
                              e.target.src = media.fullUrl;
                              return;
                            }
                          } else if (originalUrl === (media.fullUrl || '')) {
                            // If fullUrl failed, try url
                            if (media.url) {
                              console.log('Trying url in MediaLibraryModal:', media.url);
                              e.target.src = media.url;
                              return;
                            }
                          }
                          
                          // If we're here, we've tried all URLs or the current one is the last option
                          // Try to use a modified URL if the original fails
                          const modifiedUrl = originalUrl.replace(window.location.origin, 'http://localhost:5000');
                          if (modifiedUrl !== originalUrl) {
                            console.log('Trying modified URL in MediaLibraryModal:', modifiedUrl);
                            e.target.src = modifiedUrl;
                            
                            // Set a second error handler for the modified URL
                            e.target.onerror = () => {
                              console.error('All image URLs failed in MediaLibraryModal');
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.png'; // Fallback image
                            };
                          } else {
                            // If we can't modify the URL, go straight to placeholder
                            console.error('All image URLs failed in MediaLibraryModal');
                            e.target.src = '/placeholder-image.png'; // Fallback image
                          }
                        }}
                      />
                      <div className="media-name">{media.originalName || media.name || 'Unnamed'}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-media">
                  <p>No media files found</p>
                  <p className="no-media-hint">You can upload new media files from the Media section</p>
                </div>
              )}
              
              {totalMediaPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handleMediaPageChange(mediaPage - 1)}
                    disabled={mediaPage === 1}
                  >
                    Previous
                  </button>
                  <span>Page {mediaPage} of {totalMediaPages}</span>
                  <button 
                    onClick={() => handleMediaPageChange(mediaPage + 1)}
                    disabled={mediaPage === totalMediaPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="media-library-footer">
          <button 
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="refresh-button"
            onClick={() => fetchMediaFiles(1)}
            disabled={isLoadingMedia}
          >
            Refresh Media
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MediaLibraryModal;