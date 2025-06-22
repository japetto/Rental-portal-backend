import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config/config";

let server: Server;

async function main() {
  try {
    if (!config.database_url) {
      throw new Error("Database URL is not defined in config.");
    }
    await mongoose.connect(config.database_url);
    console.log("Database connected successfully");

    server = app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("Failed to connect database", err);
  }
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  }
  process.exit(1);
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

main();
