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
exports.BusinessProfileController = void 0;
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const verifyAuthToken_1 = require("../../../../util/verifyAuthToken");
const businessProfile_service_1 = require("./businessProfile.service");
const businessProfile_constant_1 = require("./businessProfile.constant");
const pagination_constant_1 = require("../../../../constants/pagination.constant");
const shared_1 = __importDefault(require("../../../../shared/shared"));
// Create Business Profile
const createBusinessProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profileData = __rest(req.body, []);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield businessProfile_service_1.BusinessProfileService.createProfile(profileData, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Profile Created Successfully",
        data: result,
    });
}));
//* Get Business Profile
const getHotelStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotelId } = req.params;
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield businessProfile_service_1.BusinessProfileService.getHotelStatistics(hotelId, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Hotel Statistics Retrieved Successfully",
        data: result,
    });
}));
//* Get Business Profile
const getBusinessProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield businessProfile_service_1.BusinessProfileService.getBusinessProfile(id, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Profile Retrieved Successfully",
        data: result,
    });
}));
// * Get all Hotels
const getAllHotels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, shared_1.default)(req.query, businessProfile_constant_1.HotelsFilterableFields);
    const options = (0, shared_1.default)(req.query, pagination_constant_1.paginationFields);
    const result = yield businessProfile_service_1.BusinessProfileService.getAllHotels(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Hotels Retrieved Successfully",
        data: result,
    });
}));
//* Get Hotel Details
const getHotelDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield businessProfile_service_1.BusinessProfileService.getHotelDetails(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Hotel Retrieved Successfully",
        data: result,
    });
}));
// * Update Business Profile
const updateBusinessProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = __rest(req.body, []);
    const token = (0, verifyAuthToken_1.verifyAuthToken)(req);
    const result = yield businessProfile_service_1.BusinessProfileService.updateBusinessProfile(payload, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Profile Updated Successfully",
        data: result,
    });
}));
exports.BusinessProfileController = {
    createBusinessProfile,
    getBusinessProfile,
    getAllHotels,
    getHotelDetails,
    updateBusinessProfile,
    getHotelStatistics,
};
