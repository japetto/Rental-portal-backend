import { z } from "zod";
import { ReviewForEnumTypes } from "./reviews.constant";

const reviewZodSchema = z.object({
  body: z.object({
    reviewForId: z.string({
      required_error: "Review For Id Id Required",
    }),
    userId: z.string({
      required_error: "User Id Required",
    }),
    rating: z
      .number({
        required_error: "Rating is Required",
      })
      .min(1)
      .max(5),
    review: z.string({
      required_error: "Review Is Required",
    }),
    reviewFor: z.enum([...ReviewForEnumTypes] as [string, ...string[]], {
      required_error: "reviewFor is Required",
    }),
  }),
});

export const ReviewsValidation = {
  reviewZodSchema,
};
