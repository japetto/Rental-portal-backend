import { z } from "zod";
import { WishlistForEnumTypes } from "./wishlist.constant";

const wishlistZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is Required",
    }),
    wishlistFor: z.enum([...WishlistForEnumTypes] as [string, ...string[]], {
      required_error: "Wishlist For is Required",
    }),
  }),
});

const deleteWishlistZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is Required",
    }),
    wishlistId: z.string({
      required_error: "Wishlist ID is Required",
    }),
  }),
});

export const WishlistValidation = {
  wishlistZodSchema,
  deleteWishlistZodSchema,
};
