export interface IAdmin {
  totalUsers: number;
  totalOwners: number;
  totalCustomers: number;
  totalBookings: number;
  totalOnboardBookings: number;
  totalSuccessfulBookings: number;
  totalCancelledBookings: number;
  totalReviews: number;
  totalPositiveReviews: number;
  totalNegativeReviews: number;
  bookingsInfo: {
    checkoutDate: string;
    totalBooking: number;
    totalSuccess: number;
    totalCancelled: number;
  }[];
}
