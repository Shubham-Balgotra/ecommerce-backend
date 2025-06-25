const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // ✅ Needed for ObjectId validation
const logger = require("../utils/logger.js");

const authenticate = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      logger.error('No token provided in request');
      return res.status(401).json({ error: "No token provided" });
    }

    if (!token.startsWith("Bearer ")) {
      logger.error('Invalid token format');
      return res.status(401).json({ error: "Invalid token format" });
    }

    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      logger.error('Invalid token');
      return res.status(401).json({ error: "Invalid token" });
    }

    // ✅ Validate userId before attaching
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      logger.error(`Invalid userId in token: ${decoded.userId}`);
      return res.status(400).json({ error: "Invalid user ID format in token" });
    }

    // ✅ Attach user info to the request safely
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    logger.info(`Authenticated user: ${decoded.email}`);
    next();

  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { authenticate };
