"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = void 0;
const zod_1 = require("zod");
const notification_constant_1 = require("./notification.constant");
const notificationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        receiverId: zod_1.z.string({
            required_error: "Receiver Id Required",
        }),
        type: zod_1.z.enum([...notification_constant_1.notificationEnums], {
            required_error: "Notification Type is Required",
        }),
        message: zod_1.z.string({
            required_error: "Message Required",
        }),
    }),
});
exports.NotificationValidation = {
    notificationZodSchema,
};
