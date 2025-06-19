import { z } from "zod";

const bookingZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID Is Required",
    }),
    reservationId: z.string({
      required_error: "Reservation ID is Required",
    }),
    hotelId: z.string({
      required_error: "Hotel ID is Required",
    }),
    reservedDays: z.number({
      required_error: "Reserved Days Required",
    }),
    startingDate: z.string({
      required_error: "Starting Date Required",
    }),
    expireDate: z.string({
      required_error: "Expire Date Required",
    }),
    reservationPrice: z.number({
      required_error: "Reservation Price is Required",
    }),
  }),
});

export const BookingValidation = {
  bookingZodSchema,
};
