import { z } from "zod";
import {
  ReservationsClassConstant,
  ReservationsTypeConstant,
} from "./reservations.constant";

const reservationZodSchema = z.object({
  body: z.object({
    profileId: z.string({
      required_error: "Hotel Owner Id is Required",
    }),
    hotelId: z.string({
      required_error: "Hotel Id is Required",
    }),
    reservationType: z.enum(
      [...ReservationsTypeConstant] as [string, ...string[]],
      {
        required_error: "Reservation Type Must be `Single, Couple or Family`",
      },
    ),
    reservationClass: z.enum(
      [...ReservationsClassConstant] as [string, ...string[]],
      {
        required_error: "Reservation Class Must Be `First, Second Or Third`",
      },
    ),
    name: z.string({
      required_error: "Reservation Name is Required",
    }),
    price: z.number({
      required_error: "Reservation Price is Required",
    }),
    discount: z.number({
      required_error: "Discount is Required",
    }),
    totalReservations: z.number({
      required_error: "Total Reservation's Count Required",
    }),
    description: z.string({
      required_error: "Description is Required",
    }),
    images: z.array(
      z.string({
        required_error: "Images Are Required",
      }),
    ),
    features: z.array(
      z.string({
        required_error: "Features Are Required",
      }),
    ),
    additionalFacilities: z
      .array(
        z.string({
          required_error: "Additional Facilities Are Required",
        }),
      )
      .default([]),
  }),
});

export const ReservationsValidation = {
  reservationZodSchema,
};
