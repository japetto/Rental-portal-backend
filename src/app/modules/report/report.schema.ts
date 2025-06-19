import { Schema, model } from "mongoose";
import { IReport } from "./report.interface";

const reportSchema = new Schema<IReport>({
  reservationId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Reservations",
  },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  bookingId: { type: Schema.Types.ObjectId, required: true },
  report: { type: String, required: true },
});

export const Report = model<IReport>("Report", reportSchema);
