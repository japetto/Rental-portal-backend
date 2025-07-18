import mongoose from "mongoose";
import app from "../src/app";
import config from "../src/config/config";

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (!config.database_url) {
    console.error("Database URL is undefined. Available config:", config);
    throw new Error("Database URL is not defined in config.");
  }

  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(config.database_url);
    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database. Error details:", error);
    console.error("Connection string used:", config.database_url);
    throw error;
  }
};

// Export the Express app as the default export
export default async function handler(req: any, res: any) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Forward the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
