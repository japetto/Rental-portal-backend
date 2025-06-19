import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination.constant";
import pick from "../../../shared/shared";
import { verifyAuthToken } from "../../../util/verifyAuthToken";

// Book Reservation
const bookedReservation = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = verifyAuthToken(req);

  const result = await BookingService.bookReservation(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reservation Booked Successfully",
    data: result,
  });
});

// Get Reservation's
const getUsersReservations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];
  const options = pick(req.query, paginationFields);
  const token = verifyAuthToken(req);

  const result = await BookingService.getUsersReservations(
    userId as string,
    options,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings Retrieved Successfully",
    data: result,
  });
});

// Cancel Reservation
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.headers["booking-id"];
  const token = verifyAuthToken(req);
  const result = await BookingService.cancelBooking(bookingId as string, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking Cancelled!",
    data: result,
  });
});

export const BookingController = {
  bookedReservation,
  getUsersReservations,
  cancelBooking,
};
