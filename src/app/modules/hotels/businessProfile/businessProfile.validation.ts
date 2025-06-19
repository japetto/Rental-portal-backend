import { z } from "zod";
import {
  AreasConstant,
  DestinationsConstant,
} from "./businessProfile.constant";

const businessProfileZodSchema = z.object({
  body: z.object({
    hotelOwnerId: z.string({
      required_error: "Owner Id is Required",
    }),
    hotelName: z.string({
      required_error: "Hotel Name is Required",
    }),
    hotelLocation: z.object({
      street: z.string({
        required_error: "Street Name is Required",
      }),
      area: z.enum([...AreasConstant] as [string, ...string[]], {
        required_error: "Hotel Area is Required",
      }),
      destination: z.enum([...DestinationsConstant] as [string, ...string[]], {
        required_error: "Hotel Destination is Required",
      }),
      coordinates: z.object({
        latitude: z.string({
          required_error: "latitude is Required",
        }),
        longitude: z.string({
          required_error: "longitude is Required",
        }),
      }),
    }),
    totalReservations: z
      .number({
        required_error: "Total Reservation is Required",
      })
      .min(0, "Total Reservation's Cannot be Less Then 0")
      .default(0),
    hotelImages: z.array(
      z.string({
        required_error: "Images Required",
      }),
    ),
    amenities: z.array(
      z.string({
        required_error: "Amenities Required",
      }),
    ),
    description: z.string({
      required_error: "Description is Required",
    }),
  }),
});

export const BusinessProfileValidation = {
  businessProfileZodSchema,
};
