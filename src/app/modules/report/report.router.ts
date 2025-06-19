import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { ReportValidation } from "./report.validation";
import { ReportController } from "./report.controller";

const router = express.Router();

router.post(
  "/reportReservation",
  zodValidationRequest(ReportValidation.reportZodSchema),
  ReportController.reportReservation,
);

router.get("/isAlreadyReported", ReportController.isAlreadyReported);

export const ReportRouter = router;
