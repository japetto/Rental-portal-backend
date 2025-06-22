import mongoose from "mongoose";
import { VercelRequest, VercelResponse } from "@vercel/node";
import config from "../dist/config/config";
import appModule from "../dist/app";

// Get the Express application
const app = appModule;

// Connect to MongoDB
async function connectDB() {
  try {
    if (!config.database_url) {
      throw new Error("Database URL is not defined in config.");
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(config.database_url);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Failed to connect database", err);
    throw err;
  }
}

// Main handler for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
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
  }  // Create custom Express handlers from Vercel request/response
  try {
    // Forward the request to our Express app
    return app(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
