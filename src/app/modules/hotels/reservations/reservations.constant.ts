import {
  ReservationsClass,
  ReservationsType,
  ReservationStatus,
} from "./reservations.interface";

export const ReservationsTypeConstant: ReservationsType[] = [
  "Single",
  "Couple",
  "Family",
];

export const ReservationsClassConstant: ReservationsClass[] = [
  "First",
  "Second",
  "Third",
];

export const ReservationsStatusConstant: ReservationStatus[] = [
  "Available",
  "Booked",
  "Blocked",
];

export const ReservationSearchableFields = [
  "name",
  "reservationType",
  "reservationClass",
  "location.destination",
  "location.area",
  "location.street",
];

export const ReservationFilterableFields = [
  "searchTerm",
  "name",
  "reservationType",
  "reservationClass",
  "area",
  "destination",
  "rating",
  "price",
];
