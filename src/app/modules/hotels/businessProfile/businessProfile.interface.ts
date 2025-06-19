import { Area, Destination } from "./businessProfile.enums";

export interface IBusinessProfile {
  hotelId: string;
  hotelOwnerId: string;
  hotelName: string;
  totalRating: number; // * Will Update while Review and Rating
  startingPrice: number; // * Will Update while Add Reservation
  hotelLocation: {
    street: string; // * Hotel Street
    area: Area; // * Hotel Area Ex: Inani Beach
    destination: Destination; // * Hotel Destination Ex: Cox's Bazar
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
  totalReservations: number;
  hotelImages: string[];
  amenities: string[];
  description: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
  email: string;
  contactNumber: string;
  establishedDate: {
    date: string;
    month: string;
    year: string;
  };
}

export interface IHotelsFilter {
  searchTerm?: string;
  hotelName?: string;
  area?: string;
  destination?: string;
  totalRating?: string;
  startingPrice?: string;
}

export interface IUpdateBusinessProfile {
  hotelId: string;
  ownerId: string;
  updateData: Partial<IBusinessProfile>;
}

export interface IHotelStatistics {
  totalBookings: number;
  totalCompletedBookings: number;
  totalPendingBookings: number;
  totalOnGoingBookings: number;
  totalCanceledBookings: number;
  totalReviews: number;
  totalPositiveReviews: number;
  totalNegativeReviews: number;
  totalMixedReviews: number;
}
