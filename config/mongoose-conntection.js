// mongoose.js
require('dotenv').config(); // Load .env variables

const mongoose = require("mongoose");
const constants = require("../utils/constants");
const logger = require("../utils/logger");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = constants.DB_NAME || "derch_db"; // fallback DB name

if (!MONGO_URI) {
  logger.db("❌ MONGO_URI is not defined in .env");
  throw new Error("MONGO_URI is not defined in .env");
}

// Connect to MongoDB
mongoose.connect(`${MONGO_URI}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.db(`✅ MongoDB connected to database: ${DB_NAME}`);
})
.catch((err) => {
  logger.db(`❌ MongoDB connection error: ${err.message}`);
  process.exit(1); // stop the app if DB connection fails
});

module.exports = mongoose.connection;
