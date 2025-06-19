import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { ReviewsValidation } from "./reviews.validation";
import { ReviewsController } from "./reviews.controller";

const router = express.Router();

router.post(
  "/addReview",
  zodValidationRequest(ReviewsValidation.reviewZodSchema),
  ReviewsController.addReview,
);

router.get("/getReviews", ReviewsController.getReviews);

router.get("/getMiniReviewsCount", ReviewsController.getMiniReviewsCount);

export const ReviewsRouter = router;
