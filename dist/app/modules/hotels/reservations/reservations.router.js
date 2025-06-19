"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRouter = void 0;
const express_1 = __importDefault(require("express"));
const zodValidationRequest_1 = __importDefault(require("../../../../middlewares/zodValidationRequest"));
const reservations_validation_1 = require("./reservations.validation");
const reservations_controller_1 = require("./reservations.controller");
const router = express_1.default.Router();
router.post("/uploadReservation", (0, zodValidationRequest_1.default)(reservations_validation_1.ReservationsValidation.reservationZodSchema), reservations_controller_1.ReservationsController.uploadReservation);
router.get("/getAllReservations", reservations_controller_1.ReservationsController.getAllReservations);
router.get("/getReservationsByHotelId/:id", reservations_controller_1.ReservationsController.getReservationsByHotelId);
router.get("/getReservationDetails/:id", reservations_controller_1.ReservationsController.getReservationDetails);
router.patch("/updateReservation", reservations_controller_1.ReservationsController.updateReservations);
exports.ReservationRouter = router;
