/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The slugified text
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word characters
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Formats a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length
 * @returns {string} - The truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Formats a number with commas for thousands
 * @param {number} number - The number to format
 * @returns {string} - The formatted number
 */
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
export const capitalizeWords = (string) => {
  if (!string) return '';
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Strips HTML tags from a string
 * @param {string} html - The HTML string
 * @returns {string} - The text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * Generates a random string of specified length
 * @param {number} length - The length of the random string
 * @returns {string} - The random string
 */
export const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};