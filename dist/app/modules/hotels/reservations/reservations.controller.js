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
exports.ReservationsController = void 0;
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const reservations_service_1 = require("./reservations.service");
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const shared_1 = __importDefault(require("../../../../shared/shared"));
const pagination_constant_1 = require("../../../../constants/pagination.constant");
const reservations_constant_1 = require("./reservations.constant");
const verifyAuthToken_1 = require("../../../../util/verifyAuthToken");
// Upload Reservation
const uploadReservation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationInfo = __rest(req.body, []);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield reservations_service_1.ReservationsService.uploadReservation(reservationInfo, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservation Created Successfully",
        data: result,
    });
}));
// Get All Reservations
const getAllReservations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, shared_1.default)(req.query, reservations_constant_1.ReservationFilterableFields);
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const result = yield reservations_service_1.ReservationsService.getAllReservations(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservations Retrieved Successfully",
        data: result,
    });
}));
// Get Reservations by HotelID
const getReservationsByHotelId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const result = yield reservations_service_1.ReservationsService.getReservationsByHotelId(id, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservations Retrieved Successfully",
        data: result,
    });
}));
// Get Reservation Details
const getReservationDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield reservations_service_1.ReservationsService.getReservationDetails(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservations Retrieved Successfully",
        data: result,
    });
}));
// Update Reservations
const updateReservations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = __rest(req.body, []);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield reservations_service_1.ReservationsService.updateReservations(updateData, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservations Updated Successfully",
        data: result,
    });
}));
// Upload New Array Data
// const uploadNewArrayData = catchAsync(async (req: Request, res: Response) => {
//   const { ...updateData } = req.body;
//   const token = verifyAuthToken(req);
//   const result = await ReservationsService.uploadNewArrayData(
//     updateData,
//     token,
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "New Data Added",
//     data: result,
//   });
// });
/**/
// Update Array Data
// const updateArrayData = catchAsync(async (req: Request, res: Response) => {
//   const { ...updateData } = req.body;
//   const token = verifyAuthToken(req);
//   const result = await ReservationsService.updateArrayData(updateData, token);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Reservations Updated Successfully",
//     data: result,
//   });
// });
exports.ReservationsController = {
    uploadReservation,
    getAllReservations,
    getReservationsByHotelId,
    getReservationDetails,
    updateReservations,
    // uploadNewArrayData,
    // updateArrayData,
};
