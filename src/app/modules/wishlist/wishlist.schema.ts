import { Schema, model } from "mongoose";
import { IWishlist } from "./wishlist.interface";
import { WishlistForEnumTypes } from "./wishlist.constant";

const wishlistSchema = new Schema<IWishlist>({
  userId: { type: String, required: true },
  reservationId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Reservations",
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "BusinessProfile",
  },
  wishlistFor: { type: String, enum: WishlistForEnumTypes, required: true },
});

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
