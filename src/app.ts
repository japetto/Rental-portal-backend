import cors from "cors";
import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import { Routers } from "./app/routes/router";
import pathNotFoundErrorHandler from "./errors/pathNotFoundErrorHandler";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: [
    "https://beckrow.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
    "Authorization",
  ],
};

// ? Middlewares:
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * Basic Page
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    message: "Rental-Portal Server Running Successfully",
    statusCode: httpStatus.OK,
  });
});

//* Main endpoint
app.use("/api/v1.0", Routers);

//* Global error Handler
app.use(globalErrorHandler);

//* Path Not Found Error Handler
app.use(pathNotFoundErrorHandler);

export default app;
