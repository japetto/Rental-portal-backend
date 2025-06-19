"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsValidation = void 0;
const zod_1 = require("zod");
const reservations_constant_1 = require("./reservations.constant");
const reservationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        profileId: zod_1.z.string({
            required_error: "Hotel Owner Id is Required",
        }),
        hotelId: zod_1.z.string({
            required_error: "Hotel Id is Required",
        }),
        reservationType: zod_1.z.enum([...reservations_constant_1.ReservationsTypeConstant], {
            required_error: "Reservation Type Must be `Single, Couple or Family`",
        }),
        reservationClass: zod_1.z.enum([...reservations_constant_1.ReservationsClassConstant], {
            required_error: "Reservation Class Must Be `First, Second Or Third`",
        }),
        name: zod_1.z.string({
            required_error: "Reservation Name is Required",
        }),
        price: zod_1.z.number({
            required_error: "Reservation Price is Required",
        }),
        discount: zod_1.z.number({
            required_error: "Discount is Required",
        }),
        totalReservations: zod_1.z.number({
            required_error: "Total Reservation's Count Required",
        }),
        description: zod_1.z.string({
            required_error: "Description is Required",
        }),
        images: zod_1.z.array(zod_1.z.string({
            required_error: "Images Are Required",
        })),
        features: zod_1.z.array(zod_1.z.string({
            required_error: "Features Are Required",
        })),
        additionalFacilities: zod_1.z
            .array(zod_1.z.string({
            required_error: "Additional Facilities Are Required",
        }))
            .default([]),
    }),
});
exports.ReservationsValidation = {
    reservationZodSchema,
};
