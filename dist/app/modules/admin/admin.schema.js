"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    totalUsers: { type: Number, required: true, min: 0 },
    totalOwners: { type: Number, required: true, min: 0 },
    totalCustomers: { type: Number, required: true, min: 0 },
    totalBookings: { type: Number, required: true, min: 0 },
    totalOnboardBookings: { type: Number, required: true, min: 0 },
    totalSuccessfulBookings: { type: Number, required: true, min: 0 },
    totalCancelledBookings: { type: Number, required: true, min: 0 },
    totalReviews: { type: Number, required: true, min: 0 },
    totalPositiveReviews: { type: Number, required: true, min: 0 },
    totalNegativeReviews: { type: Number, required: true, min: 0 },
    bookingsInfo: {
        type: [
            {
                checkoutDate: { type: String, required: true },
                totalBooking: { type: Number, required: true, min: 0 },
                totalSuccess: { type: Number, required: true, min: 0 },
                totalCancelled: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
        default: [],
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Admin = (0, mongoose_1.model)("Admin", adminSchema);
