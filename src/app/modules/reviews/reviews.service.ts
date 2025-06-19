import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { Users } from "../users/users.schema";
import {
  IGetMiniReviewsCount,
  IGetReviews,
  IReviews,
} from "./reviews.interface";
import { Reservations } from "../hotels/reservations/reservations.schema";
import { Booking } from "../booking/booking.schema";
import { Reviews } from "./reviews.schema";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config/config";
import { Secret } from "jsonwebtoken";
import { BusinessProfile } from "../hotels/businessProfile/businessProfile.schema";

const addReview = async (
  payload: IReviews,
  token: string,
): Promise<IReviews | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { userId, reviewForId, reviewFor } = payload;

  const isUserExists = await Users.findOne({ _id: userId });
  if (!isUserExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User Dose not Exists!");
  }

  if (reviewFor === "HOTEL") {
    const isHotelExists = await BusinessProfile.findOne({
      _id: reviewForId,
    });
    if (!isHotelExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Hotel Doesn't Exists!");
    }

    const latestBooking = await Booking.findOne({
      userId: userId,
      hotelId: reviewForId,
      status: "completed",
    });

    if (!latestBooking) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "User is Not Permitted to Provide a Review",
      );
    }
  }

  if (reviewFor === "RESERVATION") {
    const isReservationExists = await Reservations.findOne({
      _id: reviewForId,
    });
    if (!isReservationExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Reservation Doesn't Exists!");
    }

    const isBookedReservationExists = await Booking.findOne({
      userId,
      reservationId: reviewForId,
      status: "completed",
    });
    if (!isBookedReservationExists) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "User is Not Permitted to Provide a Review",
      );
    }
  }

  const isAlreadyReviewed = await Reviews.findOne({
    userId,
    reviewForId,
    reviewFor,
  });
  if (isAlreadyReviewed) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already Reviewed This Entity!");
  }

  const result = await Reviews.create(payload);
  return result;
};

const getMiniReviewsCount = async (
  reviewForId: string,
): Promise<IGetMiniReviewsCount> => {
  const rating = await Reviews.aggregate([
    { $match: { reviewForId } },
    { $group: { _id: "$reviewForId", avgRating: { $avg: "$rating" } } },
  ]);

  const avgRating = rating.length > 0 ? rating[0].avgRating : 0;

  const totalReviews = await Reviews.countDocuments({ reviewForId });

  return {
    avgRating,
    totalReviews,
  };
};

const getReviews = async (reviewForId: string): Promise<IGetReviews> => {
  const reviews = await Reviews.find({ reviewForId });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      reviews,
      positivePercent: 0,
      negativePercent: 0,
      mixedPercent: 0,
      totalReviews: 0,
      avgRating: 0,
    };
  }

  const rating = await Reviews.aggregate([
    { $match: { reviewForId } },
    { $group: { _id: "$reviewForId", avgRating: { $avg: "$rating" } } },
  ]);
  const avgRating = rating.length > 0 ? rating[0].avgRating : 0;

  const positiveReviews = await Reviews.countDocuments({
    reviewForId,
    rating: { $gt: 3 },
  });

  const negativeReviews = await Reviews.countDocuments({
    reviewForId,
    rating: { $lt: 3 },
  });

  const mixedReviews = await Reviews.countDocuments({
    reviewForId,
    rating: 3, // Ratings exactly 3 are mixed
  });

  const positivePercent = (positiveReviews / totalReviews) * 100;
  const negativePercent = (negativeReviews / totalReviews) * 100;
  const mixedPercent = (mixedReviews / totalReviews) * 100;

  return {
    reviews,
    positivePercent,
    negativePercent,
    mixedPercent,
    totalReviews,
    avgRating,
  };
};

export const ReviewsService = {
  addReview,
  getMiniReviewsCount,
  getReviews,
};
