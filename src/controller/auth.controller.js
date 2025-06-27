const userService = require('../services/user.service.js');
const jwtProvider = require('../config/jwtProvider.js');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger.js');
const admin = require('firebase-admin');
const fs = require('fs');

const firebaseserviceAccount = require('/etc/secrets/firebaseServiceAccount.json');


admin.initializeApp({
  credential: admin.credential.cert(firebaseserviceAccount)
});

const register = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    const jwt = jwtProvider.generateToken(user._id, user.email, user.role);
    logger.info(`User registered: ${user.email}`);
    return res.status(200).send({ jwt, user });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      logger.error(`Login failed: User not found for email ${email}`);
      return res.status(404).send({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.error(`Login failed: Invalid password for email ${email}`);
      return res.status(401).send({ error: 'Invalid email or password' });
    }
    const jwt = jwtProvider.generateToken(user._id, user.email, user.role);
    logger.info(`User logged in: ${email}`);
    return res.status(200).send({ jwt, user });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      logger.error('Google login failed: No token provided');
      return res.status(400).send({ error: 'No token provided' });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name } = decodedToken;
    logger.info(`Firebase token verified for email: ${email}`);

    let user = await userService.getUserByEmail(email);
    if (!user) {
      user = await userService.createUser({
        email,
        firstName: name?.split(' ')[0] || 'Google',
        lastName: name?.split(' ').slice(1).join(' ') || 'User',
        password: null,
        fromGoogle: true,
        role: 'USER' // Ensure role matches user.model.js
      });
      logger.info(`Created new Google user: ${email}`);
    } else if (!user.fromGoogle) {
      user.fromGoogle = true;
      user.role = user.role || 'USER';
      await user.save();
      logger.info(`Updated user to Google user: ${email}`);
    }

    const jwt = jwtProvider.generateToken(user._id, user.email, user.role);
    logger.info(`Google login successful: ${email}`);
    return res.status(200).send({ token: jwt, user });
  } catch (error) {
    logger.error(`Google login error: ${error.message}`);
    return res.status(401).send({ error: 'Google login failed' });
  }
};
// For Updating Password (used in Forgot Password flow)
const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find user by email
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: 'User not found with this email.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).send({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).send({ error: error.message });
    }
};

module.exports = { register, login, googleLogin ,updatePassword};
