"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const booking_schema_1 = require("./booking.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const reservations_schema_1 = require("../hotels/reservations/reservations.schema");
const updateBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    node_cron_1.default.schedule("56 14 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date();
        const day = date.toLocaleDateString("en-GB", {
            day: "2-digit",
        });
        const month = date.toLocaleDateString("en-GB", {
            month: "2-digit",
        });
        const year = date.toLocaleDateString("en-GB", {
            year: "numeric",
        });
        const currentDate = `${day}-${month}-${year}`;
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            //   Update Pending Bookings to onboard
            const updatePendingBookingsStatus = yield booking_schema_1.Booking.updateMany({ startingDate: currentDate }, { status: "onboard" }, { session });
            if (updatePendingBookingsStatus.acknowledged) {
                console.log("Updated Todays Pending Bookings");
            }
            //   Update OnGoing Sessions to Completed
            const updateExpiredBookingsStatus = yield booking_schema_1.Booking.updateMany({ expireDate: currentDate }, { status: "completed" }, { session });
            if (updateExpiredBookingsStatus.acknowledged) {
                console.log("Updated Todays Expired Bookings");
            }
            const getCompletedReservations = yield booking_schema_1.Booking.find({
                expireDate: currentDate,
            });
            yield Promise.all(getCompletedReservations.map((r) => __awaiter(void 0, void 0, void 0, function* () {
                yield reservations_schema_1.Reservations.findOneAndUpdate({ _id: r.reservationId }, {
                    $inc: { reservationsLeft: 1 },
                    $set: { status: "Available" },
                }, { session });
            })));
            yield session.commitTransaction();
            console.log("Booking Status Updated Successfully");
        }
        catch (error) {
            yield session.abortTransaction();
            console.error(error);
        }
        finally {
            session.endSession();
        }
    }));
});
exports.updateBooking = updateBooking;
