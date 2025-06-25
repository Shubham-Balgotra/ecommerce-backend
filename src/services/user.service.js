const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwtProvider = require("../config/jwtProvider");
const logger = require("../utils/logger.js");

const createUser = async (userData) => {
  logger.info('User data received:', userData);
  try {
    let { firstName, lastName, email, password } = userData;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      throw new Error(`User already exists with the email: ${email}`);
    }

    password = await bcrypt.hash(password, 10);

    const user = await User.create({ firstName, lastName, email, password });
    logger.info(`User created successfully: ${user._id}`);
    return user;
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    throw new Error(error.message);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User not found with the id: ${userId}`);
    }
    return user;
  } catch (error) {
    logger.error(`Error finding user by ID ${userId}: ${error.message}`);
    throw new Error(error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User not found with the email: ${email}`);
    }
    return user;
  } catch (error) {
    logger.error(`Error finding user by email ${email}: ${error.message}`);
    throw new Error(error.message);
  }
};

const getUserProfileByToken = async (token) => {
  try {
    const userId = jwtProvider.generateUserIdFromToken(token);
    const user = await findUserById(userId);
    if (!user) {
      throw new Error(`User not found with the id: ${userId}`);
    }
    return user;
  } catch (error) {
    logger.error(`Error getting user profile by token: ${error.message}`);
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();
    logger.info(`Fetched ${users.length} users`);
    return users;
  } catch (error) {
    logger.error(`Error fetching all users: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  findUserById,
  getUserByEmail,
  getUserProfileByToken,
  getAllUsers
};