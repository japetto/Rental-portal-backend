import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config/config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import {
  IAuthUser,
  IForgetPasswordValidator,
  ILoginUser,
  IUpdatePassword,
  IUpdatePasswordValidator,
  IUser,
} from "./users.interface";
import { Users } from "./users.schema";
import { generateAuthToken } from "./users.utils";

//* User Register Custom
const userRegister = async (payload: IUser): Promise<IAuthUser> => {
  const { email, password, confirmPassword } = payload;

  const isExistsUser = await Users.findOne({ email });
  if (isExistsUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email Already Exists");
  }

  if (password !== confirmPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Password and Confirm Password must match.",
    );
  }

  const user = await Users.create(payload);

  return generateAuthToken(user as any);
};

//* User Login Custom
const userLogin = async (payload: ILoginUser): Promise<IAuthUser> => {
  const { email, password } = payload;

  const isExists = await Users.findOne({ email }).select("+password");

  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  const checkPassword = await isExists.comparePassword(password);

  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  return generateAuthToken(isExists as any);
};

//* Update User
const updateUser = async (
  userID: string,
  payload: Partial<IUser>,
  token: string,
): Promise<IAuthUser | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const isExistsUser = await Users.findById({ _id: userID });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const { password, ...updatePayload } = payload;

  if (password !== undefined) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password cannot be updated through this endpoint. Use update password endpoint.",
    );
  }

  if (payload.email) {
    const isExists = await Users.findOne({ email: payload.email });
    if (isExists && isExists._id.toString() !== userID) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Email Already Exists! Try Another One.",
      );
    }
  }

  const user = await Users.findOneAndUpdate({ _id: userID }, updatePayload, {
    new: true,
  });

  return generateAuthToken(user as any);
};

// * For Updating the password
const updatePassword = async (
  payload: IUpdatePassword,
  token: string,
): Promise<IAuthUser | null> => {
  jwtHelpers.jwtVerify(token, config.jwt_secret as Secret);

  const { userId, currentPassword, newPassword, confirmPassword } = payload;

  const isExistsUser = await Users.findById({ _id: userId }).select(
    "+password",
  );
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const isPassMatched = await isExistsUser.comparePassword(currentPassword);

  if (!isPassMatched) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect current password. Please try again.",
    );
  }

  const isPreviousPass = await isExistsUser.comparePassword(newPassword);

  if (isPreviousPass || currentPassword === newPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password Cannot be The Previous Password",
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password and Confirm Password must match.",
    );
  }

  isExistsUser.password = newPassword;
  await isExistsUser.save();

  return generateAuthToken(isExistsUser as any);
};

//* Forgot Password Part-1 Find user via email
const findUserForForgotPassword = async (
  email: string,
): Promise<IForgetPasswordValidator> => {
  const user = await Users.findOne(
    { email: email },
    {
      _id: 0,
      email: 1,
    },
  ).lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid User!");
  }

  return user;
};

//* Forgot Password Part-2
const verifyOtpForForgotPassword = async (email: string, otp: string) => {
  const user = await Users.findOne(
    { email: email },
    {
      _id: 0,
      email: 1,
    },
  ).lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid User!");
  }

  return { message: "OTP verified successfully." };
};

//* Forgot Password Part-3
const forgotPassword = async (
  payload: IUpdatePasswordValidator,
): Promise<string | null> => {
  const { email, password } = payload;
  const isExistsUser = await Users.findOne({ email: email }).select(
    "+password",
  );
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid User!");
  }

  const isPreviousPass = await isExistsUser.comparePassword(password);

  if (isPreviousPass) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password Cannot be The Previous Password",
    );
  }

  isExistsUser.password = password;
  await isExistsUser.save();

  return null;
};

export const UserService = {
  userRegister,
  userLogin,
  updateUser,
  updatePassword,
  findUserForForgotPassword,
  verifyOtpForForgotPassword,
  forgotPassword,
};
