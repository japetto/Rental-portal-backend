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
exports.AdminService = void 0;
const booking_schema_1 = require("../booking/booking.schema");
const reservations_schema_1 = require("../hotels/reservations/reservations.schema");
const report_schema_1 = require("../report/report.schema");
const reviews_schema_1 = require("../reviews/reviews.schema");
const users_schema_1 = require("../users/users.schema");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config/config"));
const getDashboardInfo = (token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    // Run parallel queries for faster execution
    const [userCounts, bookingCounts, reviewCounts, aggregatedBookings] = yield Promise.all([
        // Aggregate user counts
        users_schema_1.Users.aggregate([
            {
                $facet: {
                    totalUsers: [{ $count: "count" }],
                    totalOwners: [
                        { $match: { role: "hotelOwner" } },
                        { $count: "count" },
                    ],
                    totalCustomers: [
                        { $match: { role: "customer" } },
                        { $count: "count" },
                    ],
                },
            },
        ]),
        // Aggregate booking counts
        booking_schema_1.Booking.aggregate([
            {
                $facet: {
                    totalBookings: [{ $count: "count" }],
                    totalOnboardBookings: [
                        { $match: { status: "onboard" } },
                        { $count: "count" },
                    ],
                    totalSuccessfulBookings: [
                        { $match: { status: "completed" } },
                        { $count: "count" },
                    ],
                    totalCancelledBookings: [
                        { $match: { status: "cancelled" } },
                        { $count: "count" },
                    ],
                },
            },
        ]),
        // Aggregate review counts
        reviews_schema_1.Reviews.aggregate([
            {
                $facet: {
                    totalReviews: [{ $count: "count" }],
                    totalPositiveReviews: [
                        { $match: { rating: "positive" } },
                        { $count: "count" },
                    ],
                    totalNegativeReviews: [
                        { $match: { rating: "negative" } },
                        { $count: "count" },
                    ],
                },
            },
        ]),
        // Aggregate booking info based on expireDate
        booking_schema_1.Booking.aggregate([
            {
                $group: {
                    _id: "$expireDate",
                    totalBooking: { $sum: 1 },
                    totalSuccess: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                    },
                    totalCancelled: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
                    },
                },
            },
            { $sort: { _id: 1 } }, // Sort by expireDate
        ]),
    ]);
    // Extract results from aggregation
    const { totalUsers: [{ count: totalUsers } = { count: 0 }], totalOwners: [{ count: totalOwners } = { count: 0 }], totalCustomers: [{ count: totalCustomers } = { count: 0 }], } = userCounts[0];
    const { totalBookings: [{ count: totalBookings } = { count: 0 }], totalOnboardBookings: [{ count: totalOnboardBookings } = { count: 0 }], totalSuccessfulBookings: [{ count: totalSuccessfulBookings } = { count: 0 },], totalCancelledBookings: [{ count: totalCancelledBookings } = { count: 0 }], } = bookingCounts[0];
    const { totalReviews: [{ count: totalReviews } = { count: 0 }], totalPositiveReviews: [{ count: totalPositiveReviews } = { count: 0 }], totalNegativeReviews: [{ count: totalNegativeReviews } = { count: 0 }], } = reviewCounts[0];
    // Format aggregated booking info
    const bookingInfoOutput = aggregatedBookings.map(info => ({
        checkoutDate: info._id.toISOString(), // Convert Date to String
        totalBooking: info.totalBooking,
        totalSuccess: info.totalSuccess,
        totalCancelled: info.totalCancelled,
    }));
    // Build the final dashboard info object
    const dashboardInfo = {
        totalUsers,
        totalOwners,
        totalCustomers,
        totalBookings,
        totalOnboardBookings,
        totalSuccessfulBookings,
        totalCancelledBookings,
        totalReviews,
        totalPositiveReviews,
        totalNegativeReviews,
        bookingsInfo: bookingInfoOutput,
    };
    return dashboardInfo;
});
const getAllUsers = (paginationOptions, userType, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const query = Object.assign({ role: userType }, checkAndCondition);
    const owners = yield users_schema_1.Users.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield users_schema_1.Users.countDocuments({ role: userType });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: owners,
    };
});
const getAllReservations = (paginationOptions, reservationStatus, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const query = Object.assign({ status: reservationStatus }, checkAndCondition);
    const result = yield reservations_schema_1.Reservations.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield reservations_schema_1.Reservations.countDocuments({
        status: reservationStatus,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllBookings = (paginationOptions, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const result = yield booking_schema_1.Booking.find(checkAndCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield booking_schema_1.Booking.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllReviews = (paginationOptions, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const result = yield reviews_schema_1.Reviews.find(checkAndCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield reviews_schema_1.Reviews.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllReports = (paginationOptions, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const result = yield report_schema_1.Report.find(checkAndCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield report_schema_1.Report.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.AdminService = {
    getDashboardInfo,
    getAllUsers,
    getAllReservations,
    getAllBookings,
    getAllReviews,
    getAllReports,
};
