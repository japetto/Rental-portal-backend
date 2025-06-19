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
exports.AdminController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const admin_service_1 = require("./admin.service");
const http_status_1 = __importDefault(require("http-status"));
const shared_1 = __importDefault(require("../../../shared/shared"));
const pagination_constant_1 = require("../../../constants/pagination.constant");
const verifyAuthToken_1 = require("../../../util/verifyAuthToken");
const getDashboardInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield admin_service_1.AdminService.getDashboardInfo(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard Info Retrieved Successfully",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const { userType } = req.query;
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield admin_service_1.AdminService.getAllUsers(options, userType, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Users Retrieved Successfully",
        data: result,
    });
}));
const getAllReservations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const { status } = req.query;
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield admin_service_1.AdminService.getAllReservations(options, status, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reservations Retrieved Successfully",
        data: result,
    });
}));
const getAllBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield admin_service_1.AdminService.getAllBookings(options, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Bookings Retrieved Successfully",
        data: result,
    });
}));
const getAllReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield admin_service_1.AdminService.getAllReviews(options, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reviews Retrieved Successfully",
        data: result,
    });
}));
const getAllReports = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield admin_service_1.AdminService.getAllReports(options, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reports Retrieved Successfully",
        data: result,
    });
}));
exports.AdminController = {
    getDashboardInfo,
    getAllUsers,
    getAllReservations,
    getAllBookings,
    getAllReviews,
    getAllReports,
};
