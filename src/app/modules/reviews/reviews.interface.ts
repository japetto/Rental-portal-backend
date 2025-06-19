import { Types } from "mongoose";
import { IUser } from "../users/users.interface";

export type reviewForEnumTypes = "HOTEL" | "RESERVATION";

export interface IReviews {
  userId: Types.ObjectId | Partial<IUser>;
  reviewForId: string;
  reviewFor: reviewForEnumTypes;
  rating: number;
  review: string;
}

export interface IGetMiniReviewsCount {
  totalReviews: number;
  avgRating: number;
}

export interface IGetReviews {
  reviews: IReviews[];
  positivePercent: number;
  negativePercent: number;
  mixedPercent: number;
  totalReviews: number;
  avgRating: number;
}
