import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // If we have many pages, let's limit the display
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    // Always show first page, last page, current page, and some neighbors
    const visiblePages = [];
    
    // Always add first page
    visiblePages.push(1);
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      visiblePages.push('...');
    }
    
    // Add neighbors of current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      visiblePages.push('...');
    }
    
    // Always add last page
    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }
    
    return visiblePages;
  };

  return (
    <div className="flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Page numbers */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border ${currentPage === page ? 'bg-blue-50 border-blue-500 text-blue-600 z-10' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
        
        {/* Next button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;