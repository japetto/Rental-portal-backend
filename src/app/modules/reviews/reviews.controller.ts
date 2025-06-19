import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewsService } from "./reviews.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { verifyAuthToken } from "../../../util/verifyAuthToken";

// Add Review
const addReview = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = verifyAuthToken(req);

  const result = await ReviewsService.addReview(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review Added Successfully",
    data: result,
  });
});

// getMiniReviewsCount
const getMiniReviewsCount = catchAsync(async (req: Request, res: Response) => {
  const reservationId = req.headers["reservation-id"];

  const result = await ReviewsService.getMiniReviewsCount(
    reservationId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews Retrieved Successfully",
    data: result,
  });
});

// Get Review's
const getReviews = catchAsync(async (req: Request, res: Response) => {
  const reservationId = req.headers["reservation-id"];

  const result = await ReviewsService.getReviews(reservationId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews Retrieved Successfully",
    data: result,
  });
});

export const ReviewsController = {
  addReview,
  getMiniReviewsCount,
  getReviews,
};
