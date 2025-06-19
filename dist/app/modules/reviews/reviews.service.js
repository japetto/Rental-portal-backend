"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const users_schema_1 = require("../users/users.schema");
const reservations_schema_1 = require("../hotels/reservations/reservations.schema");
const booking_schema_1 = require("../booking/booking.schema");
const reviews_schema_1 = require("./reviews.schema");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config/config"));
const businessProfile_schema_1 = require("../hotels/businessProfile/businessProfile.schema");
const addReview = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { userId, reviewForId, reviewFor } = payload;
    const isUserExists = yield users_schema_1.Users.findOne({ _id: userId });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User Dose not Exists!");
    }
    if (reviewFor === "HOTEL") {
        const isHotelExists = yield businessProfile_schema_1.BusinessProfile.findOne({
            _id: reviewForId,
        });
        if (!isHotelExists) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Hotel Doesn't Exists!");
        }
        const latestBooking = yield booking_schema_1.Booking.findOne({
            userId: userId,
            hotelId: reviewForId,
            status: "completed",
        });
        if (!latestBooking) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User is Not Permitted to Provide a Review");
        }
    }
    if (reviewFor === "RESERVATION") {
        const isReservationExists = yield reservations_schema_1.Reservations.findOne({
            _id: reviewForId,
        });
        if (!isReservationExists) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Reservation Doesn't Exists!");
        }
        const isBookedReservationExists = yield booking_schema_1.Booking.findOne({
            userId,
            reservationId: reviewForId,
            status: "completed",
        });
        if (!isBookedReservationExists) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User is Not Permitted to Provide a Review");
        }
    }
    const isAlreadyReviewed = yield reviews_schema_1.Reviews.findOne({
        userId,
        reviewForId,
        reviewFor,
    });
    if (isAlreadyReviewed) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Already Reviewed This Entity!");
    }
    const result = yield reviews_schema_1.Reviews.create(payload);
    return result;
});
const getMiniReviewsCount = (reviewForId) => __awaiter(void 0, void 0, void 0, function* () {
    const rating = yield reviews_schema_1.Reviews.aggregate([
        { $match: { reviewForId } },
        { $group: { _id: "$reviewForId", avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = rating.length > 0 ? rating[0].avgRating : 0;
    const totalReviews = yield reviews_schema_1.Reviews.countDocuments({ reviewForId });
    return {
        avgRating,
        totalReviews,
    };
});
const getReviews = (reviewForId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield reviews_schema_1.Reviews.find({ reviewForId });
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
    const rating = yield reviews_schema_1.Reviews.aggregate([
        { $match: { reviewForId } },
        { $group: { _id: "$reviewForId", avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = rating.length > 0 ? rating[0].avgRating : 0;
    const positiveReviews = yield reviews_schema_1.Reviews.countDocuments({
        reviewForId,
        rating: { $gt: 3 },
    });
    const negativeReviews = yield reviews_schema_1.Reviews.countDocuments({
        reviewForId,
        rating: { $lt: 3 },
    });
    const mixedReviews = yield reviews_schema_1.Reviews.countDocuments({
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
});
exports.ReviewsService = {
    addReview,
    getMiniReviewsCount,
    getReviews,
};
