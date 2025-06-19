"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsValidation = void 0;
const zod_1 = require("zod");
const reviews_constant_1 = require("./reviews.constant");
const reviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewForId: zod_1.z.string({
            required_error: "Review For Id Id Required",
        }),
        userId: zod_1.z.string({
            required_error: "User Id Required",
        }),
        rating: zod_1.z
            .number({
            required_error: "Rating is Required",
        })
            .min(1)
            .max(5),
        review: zod_1.z.string({
            required_error: "Review Is Required",
        }),
        reviewFor: zod_1.z.enum([...reviews_constant_1.ReviewForEnumTypes], {
            required_error: "reviewFor is Required",
        }),
    }),
});
exports.ReviewsValidation = {
    reviewZodSchema,
};
