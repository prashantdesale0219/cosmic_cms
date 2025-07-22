import React from 'react';
import ReactModal from 'react-modal';

// Set the app element for accessibility
ReactModal.setAppElement('#root');

const Modal = ({ children, title, onClose, isOpen = true, size = 'medium' }) => {
  const getMaxWidth = () => {
    switch (size) {
      case 'small':
        return '400px';
      case 'large':
        return '800px';
      case 'medium':
      default:
        return '500px';
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: getMaxWidth(),
      width: '100%',
      padding: '0',
      borderRadius: '0.375rem',
      border: 'none',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={title}
    >
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      {children}
    </ReactModal>
  );
};

export default Modal;