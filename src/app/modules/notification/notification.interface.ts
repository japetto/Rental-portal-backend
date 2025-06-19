export type NotificationEnums = "NORMAL" | "WARNING";

export interface INotification {
  receiverId: string;
  type: NotificationEnums;
  message: string;
}
