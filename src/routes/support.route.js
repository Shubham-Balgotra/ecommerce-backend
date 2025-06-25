
const express = require("express");
const router = express.Router();
const { submitMessage } = require("../controller/support.controller.js");
const { authenticate } = require('../middleware/authenticate.js');


router.post("/", authenticate, submitMessage);

module.exports = router;
