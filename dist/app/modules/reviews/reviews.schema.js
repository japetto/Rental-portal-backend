"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
const mongoose_1 = require("mongoose");
const reviews_constant_1 = require("./reviews.constant");
const reviewsSchema = new mongoose_1.Schema({
    reviewForId: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Users" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    reviewFor: { type: String, enum: reviews_constant_1.ReviewForEnumTypes, required: true },
}, {
    timestamps: true,
});
exports.Reviews = (0, mongoose_1.model)("Reviews", reviewsSchema);
