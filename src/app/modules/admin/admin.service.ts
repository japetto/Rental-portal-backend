import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IBooking } from "../booking/booking.interface";
import { Booking } from "../booking/booking.schema";
import {
  IReservations,
  ReservationStatus,
} from "../hotels/reservations/reservations.interface";
import { Reservations } from "../hotels/reservations/reservations.schema";
import { IReport } from "../report/report.interface";
import { Report } from "../report/report.schema";
import { IReviews } from "../reviews/reviews.interface";
import { Reviews } from "../reviews/reviews.schema";
import { IUser, userRoleEnums } from "../users/users.interface";
import { Users } from "../users/users.schema";
import { IAdmin } from "./admin.interface";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../interface/pagination";
import { calculatePaginationFunction } from "../../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config/config";
import { Secret } from "jsonwebtoken";

const getDashboardInfo = async (token: string): Promise<IAdmin> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  // Run parallel queries for faster execution
  const [userCounts, bookingCounts, reviewCounts, aggregatedBookings] =
    await Promise.all([
      // Aggregate user counts
      Users.aggregate([
        {
          $facet: {
            totalUsers: [{ $count: "count" }],
            totalOwners: [
              { $match: { role: "hotelOwner" } },
              { $count: "count" },
            ],
            totalCustomers: [
              { $match: { role: "customer" } },
              { $count: "count" },
            ],
          },
        },
      ]),
      // Aggregate booking counts
      Booking.aggregate([
        {
          $facet: {
            totalBookings: [{ $count: "count" }],
            totalOnboardBookings: [
              { $match: { status: "onboard" } },
              { $count: "count" },
            ],
            totalSuccessfulBookings: [
              { $match: { status: "completed" } },
              { $count: "count" },
            ],
            totalCancelledBookings: [
              { $match: { status: "cancelled" } },
              { $count: "count" },
            ],
          },
        },
      ]),
      // Aggregate review counts
      Reviews.aggregate([
        {
          $facet: {
            totalReviews: [{ $count: "count" }],
            totalPositiveReviews: [
              { $match: { rating: "positive" } },
              { $count: "count" },
            ],
            totalNegativeReviews: [
              { $match: { rating: "negative" } },
              { $count: "count" },
            ],
          },
        },
      ]),
      // Aggregate booking info based on expireDate
      Booking.aggregate([
        {
          $group: {
            _id: "$expireDate",
            totalBooking: { $sum: 1 },
            totalSuccess: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            totalCancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } }, // Sort by expireDate
      ]),
    ]);

  // Extract results from aggregation
  const {
    totalUsers: [{ count: totalUsers } = { count: 0 }],
    totalOwners: [{ count: totalOwners } = { count: 0 }],
    totalCustomers: [{ count: totalCustomers } = { count: 0 }],
  } = userCounts[0];

  const {
    totalBookings: [{ count: totalBookings } = { count: 0 }],
    totalOnboardBookings: [{ count: totalOnboardBookings } = { count: 0 }],
    totalSuccessfulBookings: [
      { count: totalSuccessfulBookings } = { count: 0 },
    ],
    totalCancelledBookings: [{ count: totalCancelledBookings } = { count: 0 }],
  } = bookingCounts[0];

  const {
    totalReviews: [{ count: totalReviews } = { count: 0 }],
    totalPositiveReviews: [{ count: totalPositiveReviews } = { count: 0 }],
    totalNegativeReviews: [{ count: totalNegativeReviews } = { count: 0 }],
  } = reviewCounts[0];

  // Format aggregated booking info
  const bookingInfoOutput = aggregatedBookings.map(info => ({
    checkoutDate: info._id.toISOString(), // Convert Date to String
    totalBooking: info.totalBooking,
    totalSuccess: info.totalSuccess,
    totalCancelled: info.totalCancelled,
  }));

  // Build the final dashboard info object
  const dashboardInfo: IAdmin = {
    totalUsers,
    totalOwners,
    totalCustomers,
    totalBookings,
    totalOnboardBookings,
    totalSuccessfulBookings,
    totalCancelledBookings,
    totalReviews,
    totalPositiveReviews,
    totalNegativeReviews,
    bookingsInfo: bookingInfoOutput,
  };

  return dashboardInfo;
};

const getAllUsers = async (
  paginationOptions: IPaginationOptions,
  userType: userRoleEnums,
  token: string,
): Promise<IGenericPaginationResponse<IUser[]>> => {
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
    role: userType,
    ...checkAndCondition,
  };

  const owners = await Users.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Users.countDocuments({ role: userType });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: owners,
  };
};

const getAllReservations = async (
  paginationOptions: IPaginationOptions,
  reservationStatus: ReservationStatus,
  token: string,
): Promise<IGenericPaginationResponse<IReservations[]>> => {
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
    status: reservationStatus,
    ...checkAndCondition,
  };

  const result = await Reservations.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Reservations.countDocuments({
    status: reservationStatus,
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

const getAllBookings = async (
  paginationOptions: IPaginationOptions,
  token: string,
): Promise<IGenericPaginationResponse<IBooking[]>> => {
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

  const result = await Booking.find(checkAndCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllReviews = async (
  paginationOptions: IPaginationOptions,
  token: string,
): Promise<IGenericPaginationResponse<IReviews[]>> => {
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

  const result = await Reviews.find(checkAndCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Reviews.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllReports = async (
  paginationOptions: IPaginationOptions,
  token: string,
): Promise<IGenericPaginationResponse<IReport[]>> => {
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

  const result = await Report.find(checkAndCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Report.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const AdminService = {
  getDashboardInfo,
  getAllUsers,
  getAllReservations,
  getAllBookings,
  getAllReviews,
  getAllReports,
};
