"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistValidation = void 0;
const zod_1 = require("zod");
const wishlist_constant_1 = require("./wishlist.constant");
const wishlistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is Required",
        }),
        wishlistFor: zod_1.z.enum([...wishlist_constant_1.WishlistForEnumTypes], {
            required_error: "Wishlist For is Required",
        }),
    }),
});
const deleteWishlistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is Required",
        }),
        wishlistId: zod_1.z.string({
            required_error: "Wishlist ID is Required",
        }),
    }),
});
exports.WishlistValidation = {
    wishlistZodSchema,
    deleteWishlistZodSchema,
};
