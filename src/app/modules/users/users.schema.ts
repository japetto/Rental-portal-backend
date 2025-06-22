import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import { UserRoleEnums } from "./user.constant";
import { IUser } from "./users.interface";

export const usersSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    profileImage: {
      type: String,
      required: true,
      default: "https://i.ibb.co/dcHVrp8/User-Profile-PNG-Image.png",
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: UserRoleEnums,
      default: "TENANT",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Hash password before saving
usersSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(
      error instanceof Error ? error : new Error("Failed to process user data"),
    );
  }
});

usersSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const Users = model<IUser>("Users", usersSchema);
