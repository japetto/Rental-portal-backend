"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRouter = void 0;
const express_1 = __importDefault(require("express"));
const zodValidationRequest_1 = __importDefault(require("../../../middlewares/zodValidationRequest"));
const wishlist_validation_1 = require("./wishlist.validation");
const wishlist_controller_1 = require("./wishlist.controller");
const router = express_1.default.Router();
router.post("/addToWishlist", (0, zodValidationRequest_1.default)(wishlist_validation_1.WishlistValidation.wishlistZodSchema), wishlist_controller_1.WishlistController.addToWishlist);
router.get("/getUsersWishlist", wishlist_controller_1.WishlistController.getUserWishlistedEntities);
router.get("/getWishlistStatus", wishlist_controller_1.WishlistController.isEntityWishlisted);
router.delete("/deleteWishlist", (0, zodValidationRequest_1.default)(wishlist_validation_1.WishlistValidation.deleteWishlistZodSchema), wishlist_controller_1.WishlistController.deleteWishlist);
exports.WishlistRouter = router;
