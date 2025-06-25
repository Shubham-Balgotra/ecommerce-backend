const Address = require("../models/address.model.js");
const User = require("../models/user.model.js");


const logger = require("../utils/logger.js");
const getAddresses = async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` is set by `authenticate` middleware
    const addresses = await Address.find({ user: user._id });
    return res.status(200).send(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).send({ error: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressData = { ...req.body, user: userId };

    const address = new Address(addressData);
    await address.save();

    // OPTIONAL: Update user's address array if needed
    await User.findByIdAndUpdate(userId, { $push: { address: address._id } });

    return res.status(201).json({
      success: true,
      meta: "Address created successfully",
      data: address,
    });
  } catch (error) {
     logger.error("Create address error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Make sure the address exists and belongs to the logged-in user
    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    logger.error("Delete address error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAddresses, createAddress, deleteAddress };