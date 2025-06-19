import httpStatus from "http-status";
import { Users } from "../users/users.schema";
import ApiError from "../../../errors/ApiError";
import { INotification } from "./notification.interface";
import { Notification } from "./notification.schema";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config/config";
import { Secret } from "jsonwebtoken";

const sendNotification = async (
  payload: INotification,
  token: string,
): Promise<INotification> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { receiverId } = payload;

  const isReceiverExists = await Users.findOne({ _id: receiverId });
  if (!isReceiverExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Receiver Dose not Exists!");
  }

  const result = await Notification.create(payload);
  return result;
};

const getNotifications = async (
  receiverId: string,
  token: string,
): Promise<INotification[]> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const notifications = await Notification.find(
    { receiverId },
    {
      _id: 1,
      message: 1,
    },
  );
  return notifications;
};

const deleteNotification = async (
  notificationId: string,
  token: string,
): Promise<INotification | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const result = await Notification.findOneAndDelete(
    { _id: notificationId },
    {
      new: true,
    },
  );

  return result;
};

export const NotificationService = {
  sendNotification,
  getNotifications,
  deleteNotification,
};
