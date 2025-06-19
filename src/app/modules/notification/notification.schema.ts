import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";
import { notificationEnums } from "./notification.constant";

const notificationSchema = new Schema<INotification>({
  receiverId: {
    type: String,
    required: true,
  },
  type: { type: String, enum: notificationEnums, required: true },
  message: { type: String, required: true },
});

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
