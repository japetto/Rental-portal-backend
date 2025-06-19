import { z } from "zod";

const reportZodSchema = z.object({
  body: z.object({
    reservationId: z.string({
      required_error: "Reservation Id Required",
    }),
    userId: z.string({
      required_error: "User Id Required",
    }),
    bookingId: z.string({
      required_error: "User Id Required",
    }),
    report: z.string({
      required_error: "Report is Required",
    }),
  }),
});

export const ReportValidation = {
  reportZodSchema,
};
