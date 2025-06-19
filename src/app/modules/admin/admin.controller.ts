import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";
import pick from "../../../shared/shared";
import { paginationFields } from "../../../constants/pagination.constant";
import { verifyAuthToken } from "../../../util/verifyAuthToken";
import { userRoleEnums } from "../users/users.interface";
import { ReservationStatus } from "../hotels/reservations/reservations.interface";

const getDashboardInfo = catchAsync(async (req: Request, res: Response) => {
  const token = verifyAuthToken(req);
  const result = await AdminService.getDashboardInfo(token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard Info Retrieved Successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const { userType } = req.query;
  const token = verifyAuthToken(req);
  const result = await AdminService.getAllUsers(
    options,
    userType as userRoleEnums,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: result,
  });
});

const getAllReservations = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const { status } = req.query;
  const token = verifyAuthToken(req);
  const result = await AdminService.getAllReservations(
    options,
    status as ReservationStatus,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reservations Retrieved Successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const token = verifyAuthToken(req);
  const result = await AdminService.getAllBookings(options, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings Retrieved Successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const token = verifyAuthToken(req);
  const result = await AdminService.getAllReviews(options, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews Retrieved Successfully",
    data: result,
  });
});

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const token = verifyAuthToken(req);
  const result = await AdminService.getAllReports(options, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reports Retrieved Successfully",
    data: result,
  });
});

export const AdminController = {
  getDashboardInfo,
  getAllUsers,
  getAllReservations,
  getAllBookings,
  getAllReviews,
  getAllReports,
};
