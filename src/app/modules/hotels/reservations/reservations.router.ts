import express from "express";
import zodValidationRequest from "../../../../middlewares/zodValidationRequest";
import { ReservationsValidation } from "./reservations.validation";
import { ReservationsController } from "./reservations.controller";

const router = express.Router();

router.post(
  "/uploadReservation",
  zodValidationRequest(ReservationsValidation.reservationZodSchema),
  ReservationsController.uploadReservation,
);

router.get("/getAllReservations", ReservationsController.getAllReservations);

router.get(
  "/getReservationsByHotelId/:id",
  ReservationsController.getReservationsByHotelId,
);

router.get(
  "/getReservationDetails/:id",
  ReservationsController.getReservationDetails,
);

router.patch("/updateReservation", ReservationsController.updateReservations);

export const ReservationRouter = router;
