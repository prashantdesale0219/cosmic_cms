import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export default generateToken;