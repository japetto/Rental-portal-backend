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
exports.BookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const users_schema_1 = require("../users/users.schema");
const reservations_schema_1 = require("../hotels/reservations/reservations.schema");
const booking_schema_1 = require("./booking.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const config_1 = __importDefault(require("../../../config/config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const businessProfile_schema_1 = require("../hotels/businessProfile/businessProfile.schema");
const bookReservation = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { userId, reservationId, hotelId } = payload;
    const isUserExists = yield users_schema_1.Users.findOne({ _id: userId });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User Doesn't Exist");
    }
    if (isUserExists.role === "hotelOwner") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Permission Denied! Please Try With Another account");
    }
    const isHotelExists = yield businessProfile_schema_1.BusinessProfile.findOne({
        _id: hotelId,
    });
    if (!isHotelExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Hotel Does Not Found!");
    }
    const isReservationExists = yield reservations_schema_1.Reservations.findOne({
        _id: reservationId,
    });
    if (!isReservationExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Reservation Not Found");
    }
    if (isReservationExists.status === "Blocked") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot Book a Blocked Reservation");
    }
    const isReservationBooked = yield booking_schema_1.Booking.findOne({
        userId,
        reservationId,
        status: { $in: ["pending", "ongoing"] },
    });
    if (isReservationBooked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Reservation Already Booked and Cannot Booked Before it's End");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const bookedReservation = yield booking_schema_1.Booking.create([payload], {
            session,
        });
        // Update reservation count and status
        let updatedReservation = yield reservations_schema_1.Reservations.findOneAndUpdate({ _id: reservationId, reservationsLeft: { $gt: 0 } }, {
            $inc: { reservationsLeft: -1 },
        }, { new: true });
        // Check if there are reservations left and update the status
        if (updatedReservation && updatedReservation.reservationsLeft === 0) {
            updatedReservation = yield reservations_schema_1.Reservations.findOneAndUpdate({ _id: reservationId }, { $set: { status: "Booked" } }, { new: true });
        }
        if (!updatedReservation) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No reservations left");
        }
        yield session.commitTransaction();
        session.endSession();
        return bookedReservation[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getUsersReservations = (userId, paginationOptions, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const query = Object.assign({ userId }, checkAndCondition);
    const bookings = yield booking_schema_1.Booking.find(query)
        .populate({
        path: "reservationId",
    })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield booking_schema_1.Booking.countDocuments({ userId });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: bookings,
    };
});
const cancelBooking = (bookingId, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const booking = yield booking_schema_1.Booking.findOne({ _id: bookingId });
    if (!booking) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Booking Not Found");
    }
    if ((booking === null || booking === void 0 ? void 0 : booking.status) === "cancelled") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Booking Already Cancelled");
    }
    if (booking.status === "completed" || booking.status === "onboard") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot Cancel an Onboard or Completed Booking!");
    }
    booking.status = "cancelled";
    const result = yield booking_schema_1.Booking.findOneAndUpdate({ _id: bookingId }, booking, {
        new: true,
    });
    return result;
});
exports.BookingService = {
    bookReservation,
    getUsersReservations,
    cancelBooking,
};
