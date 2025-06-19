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
exports.ReportService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_schema_1 = require("../users/users.schema");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const reservations_schema_1 = require("../hotels/reservations/reservations.schema");
const booking_schema_1 = require("../booking/booking.schema");
const report_schema_1 = require("./report.schema");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config/config"));
const reportReservation = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { reservationId, userId, bookingId } = payload;
    const isUserExists = yield users_schema_1.Users.findOne({ _id: userId });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User Dose not Exists!");
    }
    const isReservationExists = yield reservations_schema_1.Reservations.findOne({
        _id: reservationId,
    });
    if (!isReservationExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Reservation Doesn't Exists!");
    }
    const isBookedReservationExists = yield booking_schema_1.Booking.findOne({
        userId,
        reservationId,
        status: "completed",
        _id: bookingId,
    });
    if (!isBookedReservationExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User is Not Permitted to Report This Reservation");
    }
    const isAlreadyReported = yield report_schema_1.Report.findOne({
        userId,
        reservationId,
        bookingId,
    });
    if (isAlreadyReported) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Already Added One Report to this Booking!");
    }
    const result = yield report_schema_1.Report.create(payload);
    return result;
});
const isAlreadyReported = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, bookingId, reservationId, userId, }) {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const isAlreadyReported = yield report_schema_1.Report.exists({
        userId,
        reservationId,
        bookingId,
    });
    return !!isAlreadyReported;
});
exports.ReportService = {
    reportReservation,
    isAlreadyReported,
};
