"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const bookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID Is Required",
        }),
        reservationId: zod_1.z.string({
            required_error: "Reservation ID is Required",
        }),
        hotelId: zod_1.z.string({
            required_error: "Hotel ID is Required",
        }),
        reservedDays: zod_1.z.number({
            required_error: "Reserved Days Required",
        }),
        startingDate: zod_1.z.string({
            required_error: "Starting Date Required",
        }),
        expireDate: zod_1.z.string({
            required_error: "Expire Date Required",
        }),
        reservationPrice: zod_1.z.number({
            required_error: "Reservation Price is Required",
        }),
    }),
});
exports.BookingValidation = {
    bookingZodSchema,
};
