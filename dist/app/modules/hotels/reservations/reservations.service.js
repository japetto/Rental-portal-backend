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
exports.ReservationsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const reservations_schema_1 = require("./reservations.schema");
const reservations_utils_1 = require("./reservations.utils");
const businessProfile_schema_1 = require("../businessProfile/businessProfile.schema");
const paginationHelpers_1 = require("../../../../helpers/paginationHelpers");
const reservations_constant_1 = require("./reservations.constant");
const jwtHelpers_1 = require("../../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../../config/config"));
const uploadReservation = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { profileId, hotelId, reservationClass, reservationType, images } = payload;
    const isHotelExists = yield businessProfile_schema_1.BusinessProfile.findOne({
        $and: [{ hotelId: profileId }, { _id: hotelId }],
    });
    if (!isHotelExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Hotel Does not Exists! Create Business Profile First.");
    }
    const location = isHotelExists.hotelLocation;
    payload.location = location;
    const isExistsReservation = yield reservations_schema_1.Reservations.findOne({
        $and: [{ profileId }, { reservationClass }, { reservationType }],
    });
    if (isExistsReservation) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Reservation Already Exists!");
    }
    const reservationsCreated = yield (0, reservations_utils_1.reservationCreated)(profileId);
    if (isHotelExists.totalReservations <= reservationsCreated ||
        isHotelExists.totalReservations < payload.totalReservations) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No More Reservation Space Left!");
    }
    const reservationId = (0, reservations_utils_1.generateReservationsId)();
    const isReservationIdExists = yield reservations_schema_1.Reservations.findOne({ reservationId });
    if (isReservationIdExists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Something Went Wrong! Please Try Again");
    }
    payload.reservationId = reservationId;
    payload.reservationsLeft = payload.totalReservations;
    if (images.length < 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Must Have to Upload 5 or More Images");
    }
    // 🔽 New Logic to update startingPrice if this is the lowest price
    const lowestReservation = yield reservations_schema_1.Reservations.findOne({ profileId })
        .sort({ price: 1 })
        .select("price");
    if (!lowestReservation || payload.price < lowestReservation.price) {
        yield businessProfile_schema_1.BusinessProfile.findOneAndUpdate({ _id: hotelId }, { startingPrice: payload.price });
    }
    const result = (yield reservations_schema_1.Reservations.create(payload)).populate({
        path: "hotelId",
    });
    return result;
});
const getAllReservations = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: reservations_constant_1.ReservationSearchableFields.map(field => ({
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
                    [`location.${field}`]: value,
                });
            }
            else if (field === "rating") {
                const minRating = parseInt(value);
                const maxRating = parseInt(value) === 5 ? 5 : parseInt(value) + 0.9;
                filterConditions.push({
                    ["rating.rating"]: { $gte: minRating, $lte: maxRating },
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
    const query = Object.assign({ status: "Available" }, checkAndCondition);
    const reservations = yield reservations_schema_1.Reservations.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield reservations_schema_1.Reservations.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: reservations,
    };
});
const getReservationsByHotelId = (hotel_id, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelpers_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const query = Object.assign({ profileId: hotel_id }, checkAndCondition);
    const reservations = yield reservations_schema_1.Reservations.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield reservations_schema_1.Reservations.countDocuments({ profileId: hotel_id });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: reservations,
    };
});
const getReservationDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const reservations = yield reservations_schema_1.Reservations.findById({ _id: id }).populate({
        path: "hotelId",
        select: "_id hotelName",
    });
    return reservations;
});
const updateReservations = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwtHelpers_1.jwtHelpers.jwtVerify(token, config_1.default.jwt_secret);
    const { reservationId: id, hotelId, updateData } = payload;
    if (!id || !hotelId || !updateData) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed To Update! Please Try Again");
    }
    const { profileId, hotelId: OwnerHotelId, reservationClass, reservationType, images, status, reservationId, features, additionalFacilities, totalReservations, reservationsLeft, rating, location } = updateData, updatePayload = __rest(updateData, ["profileId", "hotelId", "reservationClass", "reservationType", "images", "status", "reservationId", "features", "additionalFacilities", "totalReservations", "reservationsLeft", "rating", "location"]);
    const isHotelExists = yield businessProfile_schema_1.BusinessProfile.findOne({ hotelId });
    if (!isHotelExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized User! Please Create Business Profile First");
    }
    const isReservationExists = yield reservations_schema_1.Reservations.findOne({
        reservationId: id,
    });
    if (!isReservationExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Reservation Not found");
    }
    if (isHotelExists.hotelId !== isReservationExists.profileId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized User! Please Try Again");
    }
    if (profileId !== undefined ||
        OwnerHotelId !== undefined ||
        reservationClass !== undefined ||
        reservationType !== undefined ||
        status !== undefined ||
        reservationId !== undefined ||
        reservationsLeft !== undefined ||
        rating !== undefined) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed To Update! Please Try Again Later");
    }
    const updatableData = updatePayload;
    if (location && Object.keys(location).length > 0) {
        Object.keys(location).map(key => {
            const updateValue = location[key];
            const profileValue = isHotelExists.hotelLocation[key];
            if (updateValue !== profileValue) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Cannot update reservation location: ${key} value does not match the business profile.`);
            }
            const locationKey = `location.${key}`;
            updatableData[locationKey] =
                location[key];
        });
    }
    if (images && images.length < 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Minimum 5 images required!");
    }
    else if (images && images.length >= 5) {
        updatableData.images = images;
    }
    if (features && !features.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Features Cannot Be Empty");
    }
    else if (features && features.length >= 5) {
        updatableData.features = features;
    }
    if (additionalFacilities && !additionalFacilities.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Additional facilities Cannot Be Empty");
    }
    else if (additionalFacilities && additionalFacilities.length >= 5) {
        updatableData.additionalFacilities = additionalFacilities;
    }
    if (isHotelExists) {
        if (totalReservations) {
            const previousReservationsCount = isReservationExists.totalReservations;
            if (previousReservationsCount > totalReservations) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Total Reservation Cannot be Less Then Previous Total Reservations!");
            }
            const previousTotalReservation = isHotelExists.totalReservations;
            const reservationsCreated = yield (0, reservations_utils_1.reservationCreated)(hotelId);
            if (previousTotalReservation <= reservationsCreated ||
                previousTotalReservation < totalReservations) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No More Reservation Space Left!");
            }
            const addedTotalReservations = totalReservations - previousReservationsCount;
            updatableData.reservationsLeft =
                isReservationExists.reservationsLeft + addedTotalReservations;
        }
    }
    const result = yield reservations_schema_1.Reservations.findOneAndUpdate({ reservationId: id }, updatableData, {
        new: true,
    });
    return result;
});
// const uploadNewArrayData = async (payload: IUploadArrayData, token: string) => {
//   jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);
//   const { data, key, reservationId } = payload;
//   const isReservationExists = await Reservations.findOne({ reservationId });
//   if (!isReservationExists) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Reservation Not Found");
//   }
//   isReservationExists[key].push(data);
//   const result = await Reservations.findOneAndUpdate(
//     { reservationId },
//     isReservationExists,
//     {
//       new: true,
//     },
//   );
//   return result;
// };
/**/
// const updateArrayData = async (updateData: IUpdateArrayData, token: string) => {
//   jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);
//   const { data, dataNo, reservationId, key } = updateData;
//   const isReservationExists = await Reservations.findOne({ reservationId });
//   if (!isReservationExists) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Reservation Not Found");
//   }
//   console.log(isReservationExists[key].length, dataNo);
//   if (dataNo < 0 || dataNo + 1 > isReservationExists[key].length) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Slot Does Not Exists!");
//   }
//   isReservationExists[key][dataNo] = data;
//   const result = await Reservations.findOneAndUpdate(
//     { reservationId },
//     isReservationExists,
//     {
//       new: true,
//     },
//   );
//   return result;
// };
exports.ReservationsService = {
    uploadReservation,
    getAllReservations,
    getReservationsByHotelId,
    getReservationDetails,
    updateReservations,
    // uploadNewArrayData,
    // updateArrayData,
};
