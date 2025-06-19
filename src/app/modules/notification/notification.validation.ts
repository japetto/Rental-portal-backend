import { z } from "zod";
import { notificationEnums } from "./notification.constant";

const notificationZodSchema = z.object({
  body: z.object({
    receiverId: z.string({
      required_error: "Receiver Id Required",
    }),
    type: z.enum([...notificationEnums] as [string, ...string[]], {
      required_error: "Notification Type is Required",
    }),
    message: z.string({
      required_error: "Message Required",
    }),
  }),
});

export const NotificationValidation = {
  notificationZodSchema,
};
