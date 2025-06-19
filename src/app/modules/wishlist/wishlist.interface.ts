import { Types } from "mongoose";
import { IReservations } from "../hotels/reservations/reservations.interface";
import { IBusinessProfile } from "../hotels/businessProfile/businessProfile.interface";

export type wishlistForEnumTypes = "HOTEL" | "RESERVATION";

export interface IWishlist {
  userId: string;
  reservationId?: Types.ObjectId | IReservations;
  hotelId?: Types.ObjectId | IBusinessProfile;
  wishlistFor: wishlistForEnumTypes;
}

export interface IDeleteWishlist {
  userId: string;
  wishlistId: string;
}
