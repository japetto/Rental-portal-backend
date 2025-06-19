"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessProfileValidation = void 0;
const zod_1 = require("zod");
const businessProfile_constant_1 = require("./businessProfile.constant");
const businessProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        hotelOwnerId: zod_1.z.string({
            required_error: "Owner Id is Required",
        }),
        hotelName: zod_1.z.string({
            required_error: "Hotel Name is Required",
        }),
        hotelLocation: zod_1.z.object({
            street: zod_1.z.string({
                required_error: "Street Name is Required",
            }),
            area: zod_1.z.enum([...businessProfile_constant_1.AreasConstant], {
                required_error: "Hotel Area is Required",
            }),
            destination: zod_1.z.enum([...businessProfile_constant_1.DestinationsConstant], {
                required_error: "Hotel Destination is Required",
            }),
            coordinates: zod_1.z.object({
                latitude: zod_1.z.string({
                    required_error: "latitude is Required",
                }),
                longitude: zod_1.z.string({
                    required_error: "longitude is Required",
                }),
            }),
        }),
        totalReservations: zod_1.z
            .number({
            required_error: "Total Reservation is Required",
        })
            .min(0, "Total Reservation's Cannot be Less Then 0")
            .default(0),
        hotelImages: zod_1.z.array(zod_1.z.string({
            required_error: "Images Required",
        })),
        amenities: zod_1.z.array(zod_1.z.string({
            required_error: "Amenities Required",
        })),
        description: zod_1.z.string({
            required_error: "Description is Required",
        }),
    }),
});
exports.BusinessProfileValidation = {
    businessProfileZodSchema,
};
