import { Request, Response } from "express";
import catchAsync from "../../../../shared/catchAsync";
import { ReservationsService } from "./reservations.service";
import sendResponse from "../../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../../shared/shared";
import { paginationFields } from "../../../../constants/pagination.constant";
import { ReservationFilterableFields } from "./reservations.constant";
import { verifyAuthToken } from "../../../../util/verifyAuthToken";

// Upload Reservation
const uploadReservation = catchAsync(async (req: Request, res: Response) => {
  const { ...reservationInfo } = req.body;
  const token = verifyAuthToken(req);

  const result = await ReservationsService.uploadReservation(
    reservationInfo,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reservation Created Successfully",
    data: result,
  });
});

// Get All Reservations
const getAllReservations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ReservationFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await ReservationsService.getAllReservations(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reservations Retrieved Successfully",
    data: result,
  });
});

// Get Reservations by HotelID
const getReservationsByHotelId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const options = pick(req.query, paginationFields);

    const result = await ReservationsService.getReservationsByHotelId(
      id as string,
      options,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reservations Retrieved Successfully",
      data: result,
    });
  },
);

// Get Reservation Details
const getReservationDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ReservationsService.getReservationDetails(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reservations Retrieved Successfully",
      data: result,
    });
  },
);

// Update Reservations
const updateReservations = catchAsync(async (req: Request, res: Response) => {
  const { ...updateData } = req.body;
  const token = verifyAuthToken(req);

  const result = await ReservationsService.updateReservations(
    updateData,
    token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reservations Updated Successfully",
    data: result,
  });
});

// Upload New Array Data
// const uploadNewArrayData = catchAsync(async (req: Request, res: Response) => {
//   const { ...updateData } = req.body;
//   const token = verifyAuthToken(req);

//   const result = await ReservationsService.uploadNewArrayData(
//     updateData,
//     token,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "New Data Added",
//     data: result,
//   });
// });

/**/

// Update Array Data
// const updateArrayData = catchAsync(async (req: Request, res: Response) => {
//   const { ...updateData } = req.body;
//   const token = verifyAuthToken(req);

//   const result = await ReservationsService.updateArrayData(updateData, token);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Reservations Updated Successfully",
//     data: result,
//   });
// });

export const ReservationsController = {
  uploadReservation,
  getAllReservations,
  getReservationsByHotelId,
  getReservationDetails,
  updateReservations,
  // uploadNewArrayData,
  // updateArrayData,
};
