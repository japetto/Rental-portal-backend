import cron from "node-cron";
import { Booking } from "./booking.schema";
import mongoose from "mongoose";
import { Reservations } from "../hotels/reservations/reservations.schema";

export const updateBooking = async () => {
  cron.schedule("56 14 * * *", async () => {
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

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      //   Update Pending Bookings to onboard
      const updatePendingBookingsStatus = await Booking.updateMany(
        { startingDate: currentDate },
        { status: "onboard" },
        { session },
      );
      if (updatePendingBookingsStatus.acknowledged) {
        console.log("Updated Todays Pending Bookings");
      }

      //   Update OnGoing Sessions to Completed
      const updateExpiredBookingsStatus = await Booking.updateMany(
        { expireDate: currentDate },
        { status: "completed" },
        { session },
      );
      if (updateExpiredBookingsStatus.acknowledged) {
        console.log("Updated Todays Expired Bookings");
      }

      const getCompletedReservations = await Booking.find({
        expireDate: currentDate,
      });

      await Promise.all(
        getCompletedReservations.map(async r => {
          await Reservations.findOneAndUpdate(
            { _id: r.reservationId },
            {
              $inc: { reservationsLeft: 1 },
              $set: { status: "Available" },
            },
            { session },
          );
        }),
      );

      await session.commitTransaction();
      console.log("Booking Status Updated Successfully");
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
    } finally {
      session.endSession();
    }
  });
};
