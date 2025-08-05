import React from 'react';

const Label = ({ 
  children, 
  className = '', 
  htmlFor,
  required = false,
  ...props 
}) => {
  const baseClasses = 'block text-sm font-medium text-gray-700 mb-1';
  
  const classes = `${baseClasses} ${className}`;
  
  return (
    <label
      className={classes}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export { Label };