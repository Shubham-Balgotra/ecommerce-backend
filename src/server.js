const app = require('./index');
const { connectDB } = require('./config/db');
const fs = require('fs');
const PORT = 5001;
require("dotenv").config();


// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port ${PORT}`);
});