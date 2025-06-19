import { Types } from "mongoose";

export type statusEnums = "pending" | "onboard" | "completed" | "cancelled";

export interface IBooking {
  userId: string;
  reservationId: Types.ObjectId;
  hotelId: Types.ObjectId;
  reservedDays: number;
  startingDate: Date;
  expireDate: Date;
  reservationPrice: number;
  status: statusEnums;
}
