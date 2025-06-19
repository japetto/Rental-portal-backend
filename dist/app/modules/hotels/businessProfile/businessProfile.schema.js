"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessProfile = exports.businessProfileSchema = void 0;
const mongoose_1 = require("mongoose");
const businessProfile_constant_1 = require("./businessProfile.constant");
exports.businessProfileSchema = new mongoose_1.Schema({
    hotelId: {
        type: String,
        required: true,
        unique: true,
    },
    hotelOwnerId: { type: String, required: true, index: true, unique: true },
    hotelName: { type: String, required: true },
    totalRating: { type: Number, required: true, default: 0, min: 0, max: 5 },
    startingPrice: { type: Number, required: true, default: 0, min: 0 },
    hotelLocation: {
        street: { type: String, required: true },
        area: { type: String, enum: businessProfile_constant_1.AreasConstant, required: true },
        destination: {
            type: String,
            enum: businessProfile_constant_1.DestinationsConstant,
            required: true,
            index: true,
        },
        coordinates: {
            latitude: { type: String, required: true, default: 0 },
            longitude: { type: String, required: true, default: 0 },
        },
    },
    hotelImages: [{ type: String, required: true }],
    totalReservations: { type: Number, required: true, min: 0, default: 0 },
    amenities: [{ type: String, required: true }],
    description: { type: String, required: true },
    socialLinks: {
        facebook: { type: String, required: true, default: "Not Updated Yet!" },
        instagram: { type: String, required: true, default: "Not Updated Yet!" },
        twitter: { type: String, required: true, default: "Not Updated Yet!" },
        linkedin: { type: String, required: true, default: "Not Updated Yet!" },
        website: { type: String, required: true, default: "Not Updated Yet!" },
    },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    establishedDate: {
        date: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.BusinessProfile = (0, mongoose_1.model)("BusinessProfile", exports.businessProfileSchema);
