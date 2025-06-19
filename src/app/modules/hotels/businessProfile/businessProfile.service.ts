import httpStatus from "http-status";
import ApiError from "../../../../errors/ApiError";
import {
  IBusinessProfile,
  IHotelsFilter,
  IHotelStatistics,
  IUpdateBusinessProfile,
  // IUpdateProfileImages,
  // IUploadNewImage,
} from "./businessProfile.interface";
import { BusinessProfile } from "./businessProfile.schema";
import { generateHotelId } from "./businessProfile.utils";
import { jwtHelpers } from "../../../../helpers/jwtHelpers";
import config from "../../../../config/config";
import { Secret } from "jsonwebtoken";
import { Users } from "../../users/users.schema";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../../interface/pagination";
import { HotelsSearchableFields } from "./businessProfile.constant";
import { calculatePaginationFunction } from "../../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { Reservations } from "../reservations/reservations.schema";
import { Booking } from "../../booking/booking.schema";
import { Reviews } from "../../reviews/reviews.schema";

// * Create Business Profile
const createProfile = async (
  payload: IBusinessProfile,
  token: string,
): Promise<IBusinessProfile> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const {
    hotelOwnerId,
    totalReservations,
    hotelImages,
    totalRating,
    amenities,
  } = payload;

  const isSellerExists = await Users.findOne(
    { uid: hotelOwnerId },
    {
      uid: 1,
    },
  );
  if (!isSellerExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Hotel Owner!");
  }

  const isExists = await BusinessProfile.findOne({ hotelOwnerId });
  if (isExists) {
    throw new ApiError(httpStatus.CONFLICT, "Hotel Already exists!");
  }

  if (hotelImages.length < 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum 5 images required!");
  }

  if (amenities.length < 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum 5 amenities required!");
  }

  if (totalReservations <= 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Reservations cannot be less than equal to 0",
    );
  }

  if (totalRating !== undefined) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to create profile! Please try again",
    );
  }

  const hotelId = generateHotelId();
  payload.hotelId = hotelId;

  const result = await BusinessProfile.create(payload);
  return result;
};

// * Get HotelStatistics
const getHotelStatistics = async (
  hotelId: string,
  token: string,
): Promise<IHotelStatistics> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const totalBookings = await Booking.countDocuments({ hotelId });
  const totalCompletedBookings = await Booking.countDocuments({
    hotelId,
    status: "completed",
  });
  const totalPendingBookings = await Booking.countDocuments({
    hotelId,
    status: "pending",
  });
  const totalOnGoingBookings = await Booking.countDocuments({
    hotelId,
    status: "onboard",
  });
  const totalCanceledBookings = await Booking.countDocuments({
    hotelId,
    status: "cancelled",
  });

  const totalReviews = await Reviews.countDocuments({ reviewFor: "HOTEL" });
  const totalPositiveReviews = await Reviews.countDocuments({
    reviewFor: "HOTEL",
    rating: { $gt: 3 },
  });
  const totalNegativeReviews = await Reviews.countDocuments({
    reviewFor: "HOTEL",
    rating: { $lt: 3 },
  });
  const totalMixedReviews = await Reviews.countDocuments({
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
};

// * Get Business Profile for Hotel Profile
const getBusinessProfile = async (
  id: string,
  token: string,
): Promise<IBusinessProfile | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const result = await BusinessProfile.findOne({ hotelOwnerId: id });
  return result;
};

//* Get All Hotels
const getAllHotels = async (
  filters: IHotelsFilter,
  paginationOptions: IPaginationOptions,
): Promise<IGenericPaginationResponse<IBusinessProfile[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: HotelsSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  //
  if (Object.keys(filterData).length) {
    const filterConditions: { [x: string]: string }[] = [];

    Object.entries(filterData).forEach(([field, value]) => {
      if (field === "destination" || field === "area") {
        filterConditions.push({
          [`hotelLocation.${field}`]: value,
        });
      } else if (field === "totalRating") {
        const minRating = parseInt(value);
        const maxRating = parseInt(value) === 5 ? 5 : parseInt(value) + 0.9;

        filterConditions.push({
          totalRating: { $gte: minRating, $lte: maxRating } as any,
        });
      } else {
        filterConditions.push({ [field]: value });
      }
    });

    andConditions.push({
      $and: filterConditions,
    });
  }
  //
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  //
  const checkAndCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const query = {
    ...checkAndCondition,
    startingPrice: { $gt: 0 },
  };

  const result = await BusinessProfile.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await BusinessProfile.countDocuments({
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
};

//* Get Hotel Details
const getHotelDetails = async (
  id: string,
): Promise<IBusinessProfile | null> => {
  const result = await BusinessProfile.findOne({ _id: id });
  return result;
};

// * Update Business Profile
const updateBusinessProfile = async (
  payload: IUpdateBusinessProfile,
  token: string,
): Promise<IBusinessProfile | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { hotelId: id, ownerId, updateData } = payload;

  const {
    hotelId,
    hotelImages,
    hotelOwnerId,
    totalReservations,
    totalRating,
    startingPrice,
    hotelLocation,
    amenities,
    ...updatePayload
  } = updateData;

  const isHotelExists = await BusinessProfile.findOne({ hotelId: id });
  if (!isHotelExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Hotel Profile Not Found!");
  }

  if (isHotelExists.hotelOwnerId !== ownerId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Something Went Wrong! Please Try Again",
    );
  }

  if (
    hotelId !== undefined ||
    hotelOwnerId !== undefined ||
    totalRating !== undefined ||
    startingPrice !== undefined
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Something Went Wrong! Please Try Again",
    );
  }

  if (totalReservations) {
    const previousTotalReservation = isHotelExists.totalReservations;
    if (previousTotalReservation > totalReservations) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Total Reservation Cannot be Less Then Previous Total Reservations!",
      );
    }
  }

  if (hotelLocation && Object.keys(hotelLocation).length > 0) {
    Object.keys(hotelLocation).forEach(key => {
      const value = hotelLocation[key as keyof typeof hotelLocation];
      console.log({ key, value });

      if (typeof value === "object" && value !== null) {
        console.log({ pass: "Object Type" });
        Object.keys(value).forEach(nestedKey => {
          const hotelLocationKey = `hotelLocation.${key}.${nestedKey}`;
          (updatePayload as any)[hotelLocationKey] =
            value[nestedKey as keyof typeof value];
        });
      } else {
        console.log({ pass: "Other Type" });
        const hotelLocationKey = `hotelLocation.${key}`;
        (updatePayload as any)[hotelLocationKey] = value;
      }
    });
  }

  if (amenities && amenities.length < 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum 5 amenities required!");
  } else if (amenities && amenities.length >= 5) {
    (updatePayload as any).amenities = amenities;
  }

  if (hotelImages && hotelImages.length < 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum 5 images required!");
  } else if (hotelImages && hotelImages.length >= 5) {
    (updatePayload as any).hotelImages = hotelImages;
  }

  const result = await BusinessProfile.findOneAndUpdate(
    { hotelId: id },
    updatePayload,
    {
      new: true,
    },
  );
  return result;
};

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

export const BusinessProfileService = {
  createProfile,
  getHotelStatistics,
  getBusinessProfile,
  getAllHotels,
  getHotelDetails,
  updateBusinessProfile,
  // updateProfileImages,
  // uploadNewImage,
};
