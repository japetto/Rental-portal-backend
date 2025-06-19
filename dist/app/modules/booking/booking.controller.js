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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const booking_service_1 = require("./booking.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_constant_1 = require("../../../constants/pagination.constant");
const shared_1 = __importDefault(require("../../../shared/shared"));
const verifyAuthToken_1 = require("../../../util/verifyAuthToken");
// Book Reservation
const bookedReservation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = __rest(req.body, []);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield booking_service_1.BookingService.bookReservation(payload, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservation Booked Successfully",
        data: result,
    });
}));
// Get Reservation's
const getUsersReservations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["user-id"];
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield booking_service_1.BookingService.getUsersReservations(userId, options, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Bookings Retrieved Successfully",
        data: result,
    });
}));
// Cancel Reservation
const cancelBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.headers["booking-id"];
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield booking_service_1.BookingService.cancelBooking(bookingId, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Booking Cancelled!",
        data: result,
    });
}));
exports.BookingController = {
    bookedReservation,
    getUsersReservations,
    cancelBooking,
};
