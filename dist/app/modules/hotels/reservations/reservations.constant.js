"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationFilterableFields = exports.ReservationSearchableFields = exports.ReservationsStatusConstant = exports.ReservationsClassConstant = exports.ReservationsTypeConstant = void 0;
exports.ReservationsTypeConstant = [
    "Single",
    "Couple",
    "Family",
];
exports.ReservationsClassConstant = [
    "First",
    "Second",
    "Third",
];
exports.ReservationsStatusConstant = [
    "Available",
    "Booked",
    "Blocked",
];
exports.ReservationSearchableFields = [
    "name",
    "reservationType",
    "reservationClass",
    "location.destination",
    "location.area",
    "location.street",
];
exports.ReservationFilterableFields = [
    "searchTerm",
    "name",
    "reservationType",
    "reservationClass",
    "area",
    "destination",
    "rating",
    "price",
];
