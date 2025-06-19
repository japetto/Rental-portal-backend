"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const booking_constant_1 = require("./booking.constant");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    reservationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Reservations",
    },
    hotelId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "BusinessProfile",
    },
    reservedDays: { type: Number, required: true },
    startingDate: { type: Date, required: true },
    expireDate: { type: Date, required: true },
    reservationPrice: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: booking_constant_1.StatusEnums,
        default: "pending",
    },
}, {
    timestamps: true,
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
