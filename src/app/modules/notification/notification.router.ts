import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { NotificationValidation } from "./notification.validation";
import { NotificationController } from "./notification.controller";

const router = express.Router();

router.post(
  "/sendNotification",
  zodValidationRequest(NotificationValidation.notificationZodSchema),
  NotificationController.sendNotification,
);

router.get("/getNotifications", NotificationController.getNotifications);

router.delete("/deleteNotification", NotificationController.deleteNotification);

export const NotificationRouter = router;
