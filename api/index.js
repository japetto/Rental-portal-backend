const mongoose = require("mongoose");
const app = require("../dist/app");
const config = require("../dist/config/config");

// Connect to MongoDB
async function connectDB() {
  try {
    if (!config.default.database_url) {
      throw new Error("Database URL is not defined in config.");
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(config.default.database_url);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Failed to connect database", err);
    throw err;
  }
}

// Main handler for Vercel
module.exports = async (req, res) => {
  // Connect to database
  await connectDB();

  // Handle CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Use Express app to handle the request
  return new Promise((resolve, reject) => {
    app.default(req, res, err => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
};
