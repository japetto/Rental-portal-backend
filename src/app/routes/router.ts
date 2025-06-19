import express from "express";
import { UserRouter } from "../modules/users/users.router";
import { businessProfileRouter } from "../modules/hotels/businessProfile/businessProfile.router";
import { ReservationRouter } from "../modules/hotels/reservations/reservations.router";
import { WishlistRouter } from "../modules/wishlist/wishlist.router";
import { BookingRouter } from "../modules/booking/booking.router";
import { ReviewsRouter } from "../modules/reviews/reviews.router";
import { ReportRouter } from "../modules/report/report.router";
import { NotificationRouter } from "../modules/notification/notification.router";
import { AdminRouter } from "../modules/admin/admin.router";

const router = express.Router();

const routes = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/hotel/businessProfile",
    route: businessProfileRouter,
  },
  {
    path: "/hotel/reservations",
    route: ReservationRouter,
  },
  {
    path: "/wishlist",
    route: WishlistRouter,
  },
  {
    path: "/booking",
    route: BookingRouter,
  },
  {
    path: "/reviews",
    route: ReviewsRouter,
  },
  {
    path: "/report",
    route: ReportRouter,
  },
  {
    path: "/notification",
    route: NotificationRouter,
  },
  {
    path: "/admin",
    route: AdminRouter,
  },
];

routes.map(r => router.use(r.path, r.route));

export const Routers = router;
