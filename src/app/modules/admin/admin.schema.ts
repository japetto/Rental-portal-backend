import { Schema, model } from "mongoose";
import { IAdmin } from "./admin.interface";

const adminSchema = new Schema<IAdmin>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Admin = model<IAdmin>("Admin", adminSchema);
