import { model, Schema, Types } from "mongoose";
import { IReservations } from "./reservations.interface";
import {
  ReservationsClassConstant,
  ReservationsStatusConstant,
  ReservationsTypeConstant,
} from "./reservations.constant";

export const reservationsSchema = new Schema<IReservations>(
  {
    profileId: { type: String, required: true },
    hotelId: { type: Types.ObjectId, required: true, ref: "BusinessProfile" },
    reservationId: { type: String, required: true, unique: true },
    reservationType: {
      type: String,
      enum: ReservationsTypeConstant,
      required: true,
    },
    reservationClass: {
      type: String,
      enum: ReservationsClassConstant,
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
      enum: ReservationsStatusConstant,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Reservations = model<IReservations>(
  "Reservations",
  reservationsSchema,
);
