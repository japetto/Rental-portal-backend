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

export const UserService = {
  userRegister,
  userLogin,
};
