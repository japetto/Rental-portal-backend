"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notification_constant_1 = require("./notification.constant");
const notificationSchema = new mongoose_1.Schema({
    receiverId: {
        type: String,
        required: true,
    },
    type: { type: String, enum: notification_constant_1.notificationEnums, required: true },
    message: { type: String, required: true },
});
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
