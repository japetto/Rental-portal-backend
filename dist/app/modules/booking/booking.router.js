"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRouter = void 0;
const express_1 = __importDefault(require("express"));
const zodValidationRequest_1 = __importDefault(require("../../../middlewares/zodValidationRequest"));
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/bookReservation", (0, zodValidationRequest_1.default)(booking_validation_1.BookingValidation.bookingZodSchema), booking_controller_1.BookingController.bookedReservation);
router.get("/getUsersReservations", booking_controller_1.BookingController.getUsersReservations);
router.patch("/cancelBooking", booking_controller_1.BookingController.cancelBooking);
exports.BookingRouter = router;
