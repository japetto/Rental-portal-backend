import express from "express";
import zodValidationRequest from "../../../../middlewares/zodValidationRequest";
import { BusinessProfileValidation } from "./businessProfile.validation";
import { BusinessProfileController } from "./businessProfile.controller";

const router = express.Router();

router.post(
  "/createBusinessProfile",
  zodValidationRequest(BusinessProfileValidation.businessProfileZodSchema),
  BusinessProfileController.createBusinessProfile,
);

router.get(
  "/getBusinessProfile/:id",
  BusinessProfileController.getBusinessProfile,
);

router.get(
  "/getHotelStatistics/:hotelId",
  BusinessProfileController.getHotelStatistics,
);

router.get("/getAllHotels", BusinessProfileController.getAllHotels);

router.get("/getHotelDetails/:id", BusinessProfileController.getHotelDetails);

router.patch(
  "/updateBusinessProfile",
  BusinessProfileController.updateBusinessProfile,
);

export const businessProfileRouter = router;
