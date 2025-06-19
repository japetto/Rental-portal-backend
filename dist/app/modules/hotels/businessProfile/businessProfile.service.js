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
exports.BusinessProfileService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const businessProfile_schema_1 = require("./businessProfile.schema");
const businessProfile_utils_1 = require("./businessProfile.utils");
const jwtHelpers_1 = require("../../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../../config/config"));
const users_schema_1 = require("../../users/users.schema");
const businessProfile_constant_1 = require("./businessProfile.constant");
const paginationHelpers_1 = require("../../../../helpers/paginationHelpers");
const booking_schema_1 = require("../../booking/booking.schema");
const reviews_schema_1 = require("../../reviews/reviews.schema");
// * Create Business Profile
const createProfile = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { hotelOwnerId, totalReservations, hotelImages, totalRating, amenities, } = payload;
    const isSellerExists = yield users_schema_1.Users.findOne({ uid: hotelOwnerId }, {
        uid: 1,
    });
    if (!isSellerExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Hotel Owner!");
    }
    const isExists = yield businessProfile_schema_1.BusinessProfile.findOne({ hotelOwnerId });
    if (isExists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Hotel Already exists!");
    }
    if (hotelImages.length < 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Minimum 5 images required!");
    }
    if (amenities.length < 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Minimum 5 amenities required!");
    }
    if (totalReservations <= 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Reservations cannot be less than equal to 0");
    }
    if (totalRating !== undefined) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create profile! Please try again");
    }
    const hotelId = (0, businessProfile_utils_1.generateHotelId)();
    payload.hotelId = hotelId;
    const result = yield businessProfile_schema_1.BusinessProfile.create(payload);
    return result;
});
// * Get HotelStatistics
const getHotelStatistics = (hotelId, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const totalBookings = yield booking_schema_1.Booking.countDocuments({ hotelId });
    const totalCompletedBookings = yield booking_schema_1.Booking.countDocuments({
        hotelId,
        status: "completed",
    });
    const totalPendingBookings = yield booking_schema_1.Booking.countDocuments({
        hotelId,
        status: "pending",
    });
    const totalOnGoingBookings = yield booking_schema_1.Booking.countDocuments({
        hotelId,
        status: "onboard",
    });
    const totalCanceledBookings = yield booking_schema_1.Booking.countDocuments({
        hotelId,
        status: "cancelled",
    });
    const totalReviews = yield reviews_schema_1.Reviews.countDocuments({ reviewFor: "HOTEL" });
    const totalPositiveReviews = yield reviews_schema_1.Reviews.countDocuments({
        reviewFor: "HOTEL",
        rating: { $gt: 3 },
    });
    const totalNegativeReviews = yield reviews_schema_1.Reviews.countDocuments({
        reviewFor: "HOTEL",
        rating: { $lt: 3 },
    });
    const totalMixedReviews = yield reviews_schema_1.Reviews.countDocuments({
        reviewFor: "HOTEL",
        rating: 3,
    });
    return {
        totalBookings, //
        totalCompletedBookings, //
        totalOnGoingBookings, //
        totalCanceledBookings, //
        totalMixedReviews, //
        totalNegativeReviews, //
        totalPendingBookings, //
        totalPositiveReviews, //
        totalReviews, //
    };
});
// * Get Business Profile for Hotel Profile
const getBusinessProfile = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const result = yield businessProfile_schema_1.BusinessProfile.findOne({ hotelOwnerId: id });
    return result;
});
//* Get All Hotels
const getAllHotels = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: businessProfile_constant_1.HotelsSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    //
    if (Object.keys(filterData).length) {
        const filterConditions = [];
        Object.entries(filterData).forEach(([field, value]) => {
            if (field === "destination" || field === "area") {
                filterConditions.push({
                    [`hotelLocation.${field}`]: value,
                });
            }
            else if (field === "totalRating") {
                const minRating = parseInt(value);
                const maxRating = parseInt(value) === 5 ? 5 : parseInt(value) + 0.9;
                filterConditions.push({
                    totalRating: { $gte: minRating, $lte: maxRating },
                });
            }
            else {
                filterConditions.push({ [field]: value });
            }
        });
        andConditions.push({
            $and: filterConditions,
        });
    }
    //
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const query = Object.assign(Object.assign({}, checkAndCondition), { startingPrice: { $gt: 0 } });
    const result = yield businessProfile_schema_1.BusinessProfile.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield businessProfile_schema_1.BusinessProfile.countDocuments({
        startingPrice: { $gt: 0 },
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
//* Get Hotel Details
const getHotelDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield businessProfile_schema_1.BusinessProfile.findOne({ _id: id });
    return result;
});
// * Update Business Profile
const updateBusinessProfile = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { hotelId: id, ownerId, updateData } = payload;
    const { hotelId, hotelImages, hotelOwnerId, totalReservations, totalRating, startingPrice, hotelLocation, amenities } = updateData, updatePayload = __rest(updateData, ["hotelId", "hotelImages", "hotelOwnerId", "totalReservations", "totalRating", "startingPrice", "hotelLocation", "amenities"]);
    const isHotelExists = yield businessProfile_schema_1.BusinessProfile.findOne({ hotelId: id });
    if (!isHotelExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Hotel Profile Not Found!");
    }
    if (isHotelExists.hotelOwnerId !== ownerId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Something Went Wrong! Please Try Again");
    }
    if (hotelId !== undefined ||
        hotelOwnerId !== undefined ||
        totalRating !== undefined ||
        startingPrice !== undefined) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Something Went Wrong! Please Try Again");
    }
    if (totalReservations) {
        const previousTotalReservation = isHotelExists.totalReservations;
        if (previousTotalReservation > totalReservations) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Total Reservation Cannot be Less Then Previous Total Reservations!");
        }
    }
    if (hotelLocation && Object.keys(hotelLocation).length > 0) {
        Object.keys(hotelLocation).forEach(key => {
            const value = hotelLocation[key];
            console.log({ key, value });
            if (typeof value === "object" && value !== null) {
                console.log({ pass: "Object Type" });
                Object.keys(value).forEach(nestedKey => {
                    const hotelLocationKey = `hotelLocation.${key}.${nestedKey}`;
                    updatePayload[hotelLocationKey] =
                        value[nestedKey];
                });
            }
            else {
                console.log({ pass: "Other Type" });
                const hotelLocationKey = `hotelLocation.${key}`;
                updatePayload[hotelLocationKey] = value;
            }
        });
    }
    if (amenities && amenities.length < 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Minimum 5 amenities required!");
    }
    else if (amenities && amenities.length >= 5) {
        updatePayload.amenities = amenities;
    }
    if (hotelImages && hotelImages.length < 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Minimum 5 images required!");
    }
    else if (hotelImages && hotelImages.length >= 5) {
        updatePayload.hotelImages = hotelImages;
    }
    const result = yield businessProfile_schema_1.BusinessProfile.findOneAndUpdate({ hotelId: id }, updatePayload, {
        new: true,
    });
    return result;
});
// * Update Profile Images
// const updateProfileImages = async (
//   payload: IUpdateProfileImages,
//   token: string,
// ): Promise<IBusinessProfile | null> => {
//   jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);
//   const { img, imgNo, hotelId } = payload;
//   const hotel = await BusinessProfile.findOne({ hotelId });
//   if (!hotel) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Hotel Not Found");
//   }
//   if (imgNo < 0 || imgNo > hotel.hotelImages.length) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Image slot Does Not Exists!");
//   }
//   hotel.hotelImages[imgNo] = img;
//   const result = await BusinessProfile.findOneAndUpdate({ hotelId }, hotel, {
//     new: true,
//   });
//   return result;
// };
/**/
// * Upload New Image
// const uploadNewImage = async (
//   payload: IUploadNewImage,
//   token: string,
// ): Promise<IBusinessProfile | null> => {
//   jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);
//   const { hotelId, img } = payload;
//   const hotel = await BusinessProfile.findOne({ hotelId });
//   if (!hotel) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Hotel Not Found");
//   }
//   hotel.hotelImages.push(img);
//   const result = await BusinessProfile.findOneAndUpdate({ hotelId }, hotel, {
//     new: true,
//   });
//   return result;
// };
exports.BusinessProfileService = {
    createProfile,
    getHotelStatistics,
    getBusinessProfile,
    getAllHotels,
    getHotelDetails,
    updateBusinessProfile,
    // updateProfileImages,
    // uploadNewImage,
};
