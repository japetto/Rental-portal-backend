"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const express_1 = __importDefault(require("express"));
const users_router_1 = require("../modules/users/users.router");
const businessProfile_router_1 = require("../modules/hotels/businessProfile/businessProfile.router");
const reservations_router_1 = require("../modules/hotels/reservations/reservations.router");
const wishlist_router_1 = require("../modules/wishlist/wishlist.router");
const booking_router_1 = require("../modules/booking/booking.router");
const reviews_router_1 = require("../modules/reviews/reviews.router");
const report_router_1 = require("../modules/report/report.router");
const notification_router_1 = require("../modules/notification/notification.router");
const admin_router_1 = require("../modules/admin/admin.router");
const router = express_1.default.Router();
const routes = [
    {
        path: "/users",
        route: users_router_1.UserRouter,
    },
    {
        path: "/hotel/businessProfile",
        route: businessProfile_router_1.businessProfileRouter,
    },
    {
        path: "/hotel/reservations",
        route: reservations_router_1.ReservationRouter,
    },
    {
        path: "/wishlist",
        route: wishlist_router_1.WishlistRouter,
    },
    {
        path: "/booking",
        route: booking_router_1.BookingRouter,
    },
    {
        path: "/reviews",
        route: reviews_router_1.ReviewsRouter,
    },
    {
        path: "/report",
        route: report_router_1.ReportRouter,
    },
    {
        path: "/notification",
        route: notification_router_1.NotificationRouter,
    },
    {
        path: "/admin",
        route: admin_router_1.AdminRouter,
    },
];
routes.map(r => router.use(r.path, r.route));
exports.Routers = router;
