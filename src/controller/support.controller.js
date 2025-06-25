const Support = require("../models/support.model.js");

exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMsg = new Support({ name, email, message });
    await newMsg.save();

    res.status(201).json({ message: "Message submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};