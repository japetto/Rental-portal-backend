import { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  role: "superadmin" | "admin" | "tenant";
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "tenant"],
      default: "tenant",
    },
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);
