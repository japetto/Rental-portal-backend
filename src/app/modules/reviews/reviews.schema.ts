import { Schema, model } from "mongoose";
import { IReviews } from "./reviews.interface";
import { ReviewForEnumTypes } from "./reviews.constant";

const reviewsSchema = new Schema<IReviews>(
  {
    reviewForId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    reviewFor: { type: String, enum: ReviewForEnumTypes, required: true },
  },
  {
    timestamps: true,
  },
);

export const Reviews = model<IReviews>("Reviews", reviewsSchema);
