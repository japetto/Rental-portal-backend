import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { BookingValidation } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/bookReservation",
  zodValidationRequest(BookingValidation.bookingZodSchema),
  BookingController.bookedReservation,
);

router.get("/getUsersReservations", BookingController.getUsersReservations);

router.patch("/cancelBooking", BookingController.cancelBooking);

export const BookingRouter = router;
