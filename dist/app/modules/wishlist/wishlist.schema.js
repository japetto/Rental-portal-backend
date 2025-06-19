"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
const mongoose_1 = require("mongoose");
const wishlist_constant_1 = require("./wishlist.constant");
const wishlistSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    reservationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "Reservations",
    },
    hotelId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "BusinessProfile",
    },
    wishlistFor: { type: String, enum: wishlist_constant_1.WishlistForEnumTypes, required: true },
});
exports.Wishlist = (0, mongoose_1.model)("Wishlist", wishlistSchema);
