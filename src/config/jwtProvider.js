require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.js');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (userId, email, role) => {
  if (!SECRET_KEY) {
    logger.error('JWT_SECRET_KEY is not defined in environment variables');
    throw new Error('JWT secret key is not configured');
  }
  try {
    const token = jwt.sign({ userId, email, role }, SECRET_KEY, { expiresIn: '1d' });
    logger.info(`JWT token generated for user: ${email}`);
    return token;
  } catch (error) {
    logger.error(`Error generating JWT token: ${error.message}`);
    throw error;
  }
};

//  Add this function
const generateUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken.userId; // make sure this matches what you stored in the token
  } catch (error) {
    logger.error(`Error decoding token: ${error.message}`);
    throw error;
  }
};

module.exports = { generateToken, generateUserIdFromToken };
