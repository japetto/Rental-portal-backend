"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservations = exports.reservationsSchema = void 0;
const mongoose_1 = require("mongoose");
const reservations_constant_1 = require("./reservations.constant");
exports.reservationsSchema = new mongoose_1.Schema({
    profileId: { type: String, required: true },
    hotelId: { type: mongoose_1.Types.ObjectId, required: true, ref: "BusinessProfile" },
    reservationId: { type: String, required: true, unique: true },
    reservationType: {
        type: String,
        enum: reservations_constant_1.ReservationsTypeConstant,
        required: true,
    },
    reservationClass: {
        type: String,
        enum: reservations_constant_1.ReservationsClassConstant,
        required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    location: {
        street: { type: String, required: true },
        area: { type: String, required: true },
        destination: { type: String, required: true },
    },
    totalReservations: { type: Number, required: true },
    reservationsLeft: { type: Number, required: true },
    status: {
        type: String,
        enum: reservations_constant_1.ReservationsStatusConstant,
        required: true,
        default: "Available",
    },
    description: { type: String, required: true },
    images: [{ type: String, required: true, min: 5 }],
    features: [{ type: String, required: true }],
    additionalFacilities: [{ type: String, required: true, default: [] }],
    rating: {
        total: { type: Number, required: true, default: 0 },
        rating: { type: Number, required: true, default: 0 },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Reservations = (0, mongoose_1.model)("Reservations", exports.reservationsSchema);
