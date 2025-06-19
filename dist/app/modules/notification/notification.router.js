"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const zodValidationRequest_1 = __importDefault(require("../../../middlewares/zodValidationRequest"));
const notification_validation_1 = require("./notification.validation");
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.post("/sendNotification", (0, zodValidationRequest_1.default)(notification_validation_1.NotificationValidation.notificationZodSchema), notification_controller_1.NotificationController.sendNotification);
router.get("/getNotifications", notification_controller_1.NotificationController.getNotifications);
router.delete("/deleteNotification", notification_controller_1.NotificationController.deleteNotification);
exports.NotificationRouter = router;
