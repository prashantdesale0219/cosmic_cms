/**
 * Utility function to catch async errors in route handlers
 * Eliminates the need for try/catch blocks in controllers
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;