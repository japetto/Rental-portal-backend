import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { UserController } from "./users.controller";
import { UserValidation } from "./users.validation";

const router = express.Router();

router.post(
  "/register",
  zodValidationRequest(UserValidation.usersZodSchema),
  UserController.userRegister,
);

router.post(
  "/login",
  zodValidationRequest(UserValidation.loginUserZodSchema),
  UserController.userLogin,
);

export const UserRouter = router;
