import { Request, Response } from "express";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import httpStatus from "http-status";
import { verifyAuthToken } from "../../../../util/verifyAuthToken";
import { BusinessProfileService } from "./businessProfile.service";
import { HotelsFilterableFields } from "./businessProfile.constant";
import { paginationFields } from "../../../../constants/pagination.constant";
import pick from "../../../../shared/shared";

// Create Business Profile
const createBusinessProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { ...profileData } = req.body;
    const token = verifyAuthToken(req);

    const result = await BusinessProfileService.createProfile(
      profileData,
      token,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile Created Successfully",
      data: result,
    });
  },
);

//* Get Business Profile
const getHotelStatistics = catchAsync(async (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const token = verifyAuthToken(req);
  const result = await BusinessProfileService.getHotelStatistics(
    hotelId,
    token,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Hotel Statistics Retrieved Successfully",
    data: result,
  });
});

//* Get Business Profile
const getBusinessProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = verifyAuthToken(req);
  const result = await BusinessProfileService.getBusinessProfile(id, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile Retrieved Successfully",
    data: result,
  });
});

// * Get all Hotels
const getAllHotels = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, HotelsFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await BusinessProfileService.getAllHotels(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Hotels Retrieved Successfully",
    data: result,
  });
});

//* Get Hotel Details
const getHotelDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BusinessProfileService.getHotelDetails(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Hotel Retrieved Successfully",
    data: result,
  });
});

// * Update Business Profile
const updateBusinessProfile = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;
    const token = verifyAuthToken(req);
    const result = await BusinessProfileService.updateBusinessProfile(
      payload,
      token,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile Updated Successfully",
      data: result,
    });
  },
);

export const BusinessProfileController = {
  createBusinessProfile,
  getBusinessProfile,
  getAllHotels,
  getHotelDetails,
  updateBusinessProfile,
  getHotelStatistics,
};
