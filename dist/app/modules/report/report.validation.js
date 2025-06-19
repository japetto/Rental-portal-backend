"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportValidation = void 0;
const zod_1 = require("zod");
const reportZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        reservationId: zod_1.z.string({
            required_error: "Reservation Id Required",
        }),
        userId: zod_1.z.string({
            required_error: "User Id Required",
        }),
        bookingId: zod_1.z.string({
            required_error: "User Id Required",
        }),
        report: zod_1.z.string({
            required_error: "Report is Required",
        }),
    }),
});
exports.ReportValidation = {
    reportZodSchema,
};
