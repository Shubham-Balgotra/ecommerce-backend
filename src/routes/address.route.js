const express = require("express");
const router = express.Router();
const { getAddresses, createAddress, deleteAddress } = require("../controller/address.controller.js"); // ✅ fixed path
const { authenticate } = require('../middleware/authenticate.js');

// Use the individual named functions
router.get("/", authenticate, getAddresses);
router.post("/", authenticate, createAddress);
router.delete("/:id", authenticate, deleteAddress);

module.exports = router;
