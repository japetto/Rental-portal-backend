"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    reservationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Reservations",
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Users" },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    report: { type: String, required: true },
});
exports.Report = (0, mongoose_1.model)("Report", reportSchema);
