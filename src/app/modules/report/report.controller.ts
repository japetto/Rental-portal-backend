import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReportService } from "./report.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { verifyAuthToken } from "../../../util/verifyAuthToken";

const reportReservation = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = verifyAuthToken(req);

  const result = await ReportService.reportReservation(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking Reported!",
    data: result,
  });
});

const isAlreadyReported = catchAsync(async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  const bookingId = req.headers["booking-id"];
  const reservationId = req.headers["reservation-id"];
  const token = verifyAuthToken(req);

  const result = await ReportService.isAlreadyReported({
    token,
    userId: String(userId),
    bookingId: String(bookingId),
    reservationId: String(reservationId),
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Report Status Checked!",
    data: result,
  });
});

export const ReportController = {
  reportReservation,
  isAlreadyReported,
};
