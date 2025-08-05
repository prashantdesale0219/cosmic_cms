import React from 'react';

const Input = ({ 
  className = '', 
  type = 'text', 
  placeholder = '',
  value,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed';
  
  const classes = `${baseClasses} ${className}`;
  
  return (
    <input
      type={type}
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      disabled={disabled}
      required={required}
      {...props}
    />
  );
};

export { Input };