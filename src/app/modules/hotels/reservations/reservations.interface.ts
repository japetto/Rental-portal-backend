import { Types } from "mongoose";
import { IBusinessProfile } from "../businessProfile/businessProfile.interface";

export type ReservationsType = "Single" | "Couple" | "Family";
export type ReservationsClass = "First" | "Second" | "Third";
export type ReservationStatus = "Booked" | "Available" | "Blocked";

export type IReservations = {
  profileId: string;
  hotelId: Types.ObjectId | Partial<IBusinessProfile>;
  reservationId: string;
  reservationType: ReservationsType;
  reservationClass: ReservationsClass;
  name: string;
  price: number;
  discount: number;
  location: {
    street: string;
    area: string;
    destination: string;
  };
  totalReservations: number;
  reservationsLeft: number;
  status: ReservationStatus;
  description: string;
  features: string[];
  additionalFacilities: string[];
  images: string[];
  rating: {
    total: number;
    rating: number;
  };
};

export interface IReservationFilters {
  searchTerm?: string;
  name?: string;
  reservationType?: ReservationsType;
  reservationClass?: ReservationsClass;
  area?: string;
  destination?: string;
  rating?: string;
  price?: string;
}

export interface IUpdateReservation {
  reservationId: string;
  hotelId: string;
  updateData: Partial<IReservations>;
}

export type IUpdatableArrayKey = "features" | "additionalFacilities" | "images";

export interface IUploadArrayData {
  key: IUpdatableArrayKey;
  reservationId: string;
  data: string;
}

export interface IUpdateArrayData {
  key: IUpdatableArrayKey;
  reservationId: string;
  data: string;
  dataNo: number;
}
