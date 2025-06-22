import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { verifyAuthToken } from "../../../util/verifyAuthToken";
import { UserService } from "./users.service";

// User Register
const userRegister = catchAsync(async (req: Request, res: Response) => {
  const { ...userInfo } = req.body;

  const result = await UserService.userRegister(userInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Registration Successful",
    data: result,
  });
});

// User Login
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...authCredentials } = req.body;

  const result = await UserService.userLogin(authCredentials);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login Successful",
    data: result,
  });
});

export const UserController = {
  userRegister,
  userLogin,
};
