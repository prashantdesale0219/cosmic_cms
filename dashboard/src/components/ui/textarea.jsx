import React from 'react';

const Textarea = ({ 
  className = '', 
  placeholder = '',
  value,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  rows = 4,
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical';
  
  const classes = `${baseClasses} ${className}`;
  
  return (
    <textarea
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      disabled={disabled}
      required={required}
      rows={rows}
      {...props}
    />
  );
};

export { Textarea };