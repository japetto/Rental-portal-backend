import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { NotificationService } from "./notification.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { verifyAuthToken } from "../../../util/verifyAuthToken";

const sendNotification = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = verifyAuthToken(req);

  const result = await NotificationService.sendNotification(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification Sent!",
    data: result,
  });
});

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const receiverId = req.headers["receiver-id"];
  const token = verifyAuthToken(req);

  const result = await NotificationService.getNotifications(
    receiverId as string,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification's Retrieved!",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { notificationId } = req.body;
  const token = verifyAuthToken(req);

  const result = await NotificationService.deleteNotification(
    notificationId,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification Deleted!",
    data: result,
  });
});

export const NotificationController = {
  sendNotification,
  getNotifications,
  deleteNotification,
};
