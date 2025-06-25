require('dotenv').config();
const mongoose = require("mongoose");

// Get MongoDB URI from environment variable
const mongodbUrl = process.env.MONGO_URI;

const connectDB = () => {
    return mongoose.connect(mongodbUrl)

    // return mongoose.connect(mongodbUrl, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });
};

module.exports = { connectDB };
