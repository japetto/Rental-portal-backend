import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { Users } from "../users/users.schema";
import {
  IDeleteWishlist,
  IWishlist,
  wishlistForEnumTypes,
} from "./wishlist.interface";
import { Reservations } from "../hotels/reservations/reservations.schema";
import { Wishlist } from "./wishlist.schema";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../interface/pagination";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config/config";
import { Secret } from "jsonwebtoken";
import { BusinessProfile } from "../hotels/businessProfile/businessProfile.schema";

const addToWishlist = async (
  payload: IWishlist,
  token: string,
): Promise<IWishlist> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { userId, reservationId, hotelId, wishlistFor } = payload;

  const isUserExists = await Users.findOne({ _id: userId });
  if (!isUserExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User Doesn't Exist's");
  }

  if (wishlistFor === "RESERVATION") {
    if (!reservationId || reservationId === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Reservation Id Required");
    }

    const isReservationExists = await Reservations.findOne({
      _id: reservationId,
    });
    if (!isReservationExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Reservation Doesn't Exist's");
    }
  }

  if (wishlistFor === "HOTEL") {
    if (!hotelId || hotelId === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Reservation Id Required");
    }

    const isReservationExists = await BusinessProfile.findOne({
      _id: hotelId,
    });
    if (!isReservationExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Reservation Doesn't Exist's");
    }
  }

  const result = await Wishlist.create(payload);
  return result;
};

const getUserWishlistedEntities = async (
  userId: string,
  wishlistFor: wishlistForEnumTypes,
  paginationOptions: IPaginationOptions,
  token: string,
): Promise<IGenericPaginationResponse<IWishlist[]>> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

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
    userId,
    wishlistFor,
    ...checkAndCondition,
  };

  const populatePath =
    wishlistFor === "RESERVATION" ? "reservationId" : "hotelId";

  const result = await Wishlist.find(query)
    .populate({
      path: populatePath,
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Wishlist.countDocuments({ userId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const isEntityWishlisted = async (
  userId: string,
  entityId: string,
  wishlistFor: wishlistForEnumTypes,
): Promise<boolean> => {
  if (wishlistFor === "RESERVATION") {
    const isEntityWishlisted = await Wishlist.findOne({
      userId,
      reservationId: entityId,
    });

    return isEntityWishlisted ? true : false;
  }

  if (wishlistFor === "HOTEL") {
    const isEntityWishlisted = await Wishlist.findOne({
      userId,
      hotelId: entityId,
    });

    return isEntityWishlisted ? true : false;
  }

  return false;
};

const deleteWishlist = async (
  payload: IDeleteWishlist,
  token: string,
): Promise<IWishlist | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { userId, wishlistId } = payload;

  const isUserExists = await Users.findOne({ _id: userId });
  if (!isUserExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User Doesn't Exist's");
  }

  const isWishlistExists = await Wishlist.findOne({ _id: wishlistId, userId });
  if (!isWishlistExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Entity Doesn't Exists on Wishlist",
    );
  }

  if (isWishlistExists.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Permission Denied! Please Try Again.",
    );
  }

  const result = await Wishlist.findOneAndDelete(
    { _id: wishlistId },
    {
      new: true,
    },
  );

  return result;
};

export const WishlistService = {
  addToWishlist,
  getUserWishlistedEntities,
  isEntityWishlisted,
  deleteWishlist,
};
