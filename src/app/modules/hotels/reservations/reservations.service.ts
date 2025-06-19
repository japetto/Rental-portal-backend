import httpStatus from "http-status";
import ApiError from "../../../../errors/ApiError";
import {
  IReservationFilters,
  IReservations,
  IUpdateArrayData,
  IUpdateReservation,
  IUploadArrayData,
} from "./reservations.interface";
import { Reservations } from "./reservations.schema";
import {
  generateReservationsId,
  reservationCreated,
} from "./reservations.utils";
import { BusinessProfile } from "../businessProfile/businessProfile.schema";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../../interface/pagination";
import { calculatePaginationFunction } from "../../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { ReservationSearchableFields } from "./reservations.constant";
import { jwtHelpers } from "../../../../helpers/jwtHelpers";
import config from "../../../../config/config";
import { Secret } from "jsonwebtoken";

const uploadReservation = async (
  payload: IReservations,
  token: string,
): Promise<IReservations> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { profileId, hotelId, reservationClass, reservationType, images } =
    payload;

  const isHotelExists = await BusinessProfile.findOne({
    $and: [{ hotelId: profileId }, { _id: hotelId }],
  });
  if (!isHotelExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Hotel Does not Exists! Create Business Profile First.",
    );
  }

  const location = isHotelExists.hotelLocation;

  payload.location = location;

  const isExistsReservation = await Reservations.findOne({
    $and: [{ profileId }, { reservationClass }, { reservationType }],
  });
  if (isExistsReservation) {
    throw new ApiError(httpStatus.CONFLICT, "Reservation Already Exists!");
  }

  const reservationsCreated = await reservationCreated(profileId);
  if (
    isHotelExists.totalReservations <= reservationsCreated ||
    isHotelExists.totalReservations < payload.totalReservations
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No More Reservation Space Left!",
    );
  }

  const reservationId = generateReservationsId();

  const isReservationIdExists = await Reservations.findOne({ reservationId });
  if (isReservationIdExists) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Something Went Wrong! Please Try Again",
    );
  }

  payload.reservationId = reservationId;

  payload.reservationsLeft = payload.totalReservations;

  if (images.length < 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Must Have to Upload 5 or More Images",
    );
  }

  // 🔽 New Logic to update startingPrice if this is the lowest price
  const lowestReservation = await Reservations.findOne({ profileId })
    .sort({ price: 1 })
    .select("price");

  if (!lowestReservation || payload.price < lowestReservation.price) {
    await BusinessProfile.findOneAndUpdate(
      { _id: hotelId },
      { startingPrice: payload.price },
    );
  }

  const result = (await Reservations.create(payload)).populate({
    path: "hotelId",
  });

  return result;
};

const getAllReservations = async (
  filters: IReservationFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericPaginationResponse<IReservations[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: ReservationSearchableFields.map(field => ({
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
          [`location.${field}`]: value,
        });
      } else if (field === "rating") {
        const minRating = parseInt(value);
        const maxRating = parseInt(value) === 5 ? 5 : parseInt(value) + 0.9;

        filterConditions.push({
          ["rating.rating"]: { $gte: minRating, $lte: maxRating } as any,
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
    status: "Available",
    ...checkAndCondition,
  };

  const reservations = await Reservations.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Reservations.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: reservations,
  };
};

const getReservationsByHotelId = async (
  hotel_id: string,
  paginationOptions: IPaginationOptions,
): Promise<IGenericPaginationResponse<IReservations[]>> => {
  const andConditions: string | any[] = [];

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
    profileId: hotel_id,
    ...checkAndCondition,
  };

  const reservations = await Reservations.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Reservations.countDocuments({ profileId: hotel_id });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: reservations,
  };
};

const getReservationDetails = async (
  id: string,
): Promise<IReservations | null> => {
  const reservations = await Reservations.findById({ _id: id }).populate({
    path: "hotelId",
    select: "_id hotelName",
  });
  return reservations;
};

const updateReservations = async (
  payload: IUpdateReservation,
  token: string,
): Promise<IReservations | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { reservationId: id, hotelId, updateData } = payload;
  if (!id || !hotelId || !updateData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed To Update! Please Try Again",
    );
  }

  const {
    profileId,
    hotelId: OwnerHotelId,
    reservationClass,
    reservationType,
    images,
    status,
    reservationId,
    features,
    additionalFacilities,
    totalReservations,
    reservationsLeft,
    rating,
    location,
    ...updatePayload
  } = updateData;

  const isHotelExists = await BusinessProfile.findOne({ hotelId });
  if (!isHotelExists) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized User! Please Create Business Profile First",
    );
  }

  const isReservationExists = await Reservations.findOne({
    reservationId: id,
  });
  if (!isReservationExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Reservation Not found");
  }

  if (isHotelExists.hotelId !== isReservationExists.profileId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized User! Please Try Again",
    );
  }

  if (
    profileId !== undefined ||
    OwnerHotelId !== undefined ||
    reservationClass !== undefined ||
    reservationType !== undefined ||
    status !== undefined ||
    reservationId !== undefined ||
    reservationsLeft !== undefined ||
    rating !== undefined
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed To Update! Please Try Again Later",
    );
  }

  const updatableData = updatePayload as any;

  if (location && Object.keys(location).length > 0) {
    Object.keys(location).map(key => {
      const updateValue = location[key as keyof typeof location];
      const profileValue =
        isHotelExists.hotelLocation[
          key as keyof typeof isHotelExists.hotelLocation
        ];

      if (updateValue !== profileValue) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Cannot update reservation location: ${key} value does not match the business profile.`,
        );
      }

      const locationKey = `location.${key}`;
      (updatableData as any)[locationKey] =
        location[key as keyof typeof location];
    });
  }

  if (images && images.length < 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum 5 images required!");
  } else if (images && images.length >= 5) {
    updatableData.images = images;
  }

  if (features && !features.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Features Cannot Be Empty");
  } else if (features && features.length >= 5) {
    updatableData.features = features;
  }

  if (additionalFacilities && !additionalFacilities.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Additional facilities Cannot Be Empty",
    );
  } else if (additionalFacilities && additionalFacilities.length >= 5) {
    updatableData.additionalFacilities = additionalFacilities;
  }

  if (isHotelExists) {
    if (totalReservations) {
      const previousReservationsCount = isReservationExists.totalReservations;
      if (previousReservationsCount > totalReservations) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Total Reservation Cannot be Less Then Previous Total Reservations!",
        );
      }

      const previousTotalReservation = isHotelExists.totalReservations;
      const reservationsCreated = await reservationCreated(hotelId);
      if (
        previousTotalReservation <= reservationsCreated ||
        previousTotalReservation < totalReservations
      ) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "No More Reservation Space Left!",
        );
      }

      const addedTotalReservations =
        totalReservations - previousReservationsCount;
      updatableData.reservationsLeft =
        isReservationExists.reservationsLeft + addedTotalReservations;
    }
  }

  const result = await Reservations.findOneAndUpdate(
    { reservationId: id },
    updatableData,
    {
      new: true,
    },
  );

  return result;
};

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

export const ReservationsService = {
  uploadReservation,
  getAllReservations,
  getReservationsByHotelId,
  getReservationDetails,
  updateReservations,
  // uploadNewArrayData,
  // updateArrayData,
};
