import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (_req, res) => {
  res.send("🚀 API is running and database is connected!");
});

export default app;
