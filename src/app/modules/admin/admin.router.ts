import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/getDashboardInfo", AdminController.getDashboardInfo);

router.get("/getAllUsers", AdminController.getAllUsers);

router.get("/getAllReservations", AdminController.getAllReservations);

router.get("/getAllBookings", AdminController.getAllBookings);

router.get("/getAllReviews", AdminController.getAllReviews);

router.get("/getAllReports", AdminController.getAllReports);

export const AdminRouter = router;
