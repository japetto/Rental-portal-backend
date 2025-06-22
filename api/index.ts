import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";
import express from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Routers } from "../src/app/routes/router";
import config from "../src/config/config";
import pathNotFoundErrorHandler from "../src/errors/pathNotFoundErrorHandler";
import globalErrorHandler from "../src/middlewares/globalErrorHandler";

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Page
app.get("/", async (req: express.Request, res: express.Response) => {
  res.status(httpStatus.OK).send({
    message: "Rental-Portal Server Running Successfully",
    statusCode: httpStatus.OK,
  });
});

// Main endpoint
app.use("/api/v1.0", Routers);

// Global error Handler
app.use(globalErrorHandler);

// Path Not Found Error Handler
app.use(pathNotFoundErrorHandler);

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
export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // Convert Vercel request to Express request format
  const expressReq = req as any;
  const expressRes = res as any;

  // Use Express app to handle the request
  return new Promise((resolve, reject) => {
    app(expressReq, expressRes, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}
