import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import slugify from "slugify";
import { UserRoleEnums } from "./user.constant";
import { IUser } from "./users.interface";

export const usersSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
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
  }
);

// Generate slug before validation
usersSchema.pre("validate", async function (next) {
  try {
    if (!this.name) {
      return next(new Error("Name is required"));
    }

    if (this.isNew || this.isModified("name")) {
      const baseSlug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
      });

      if (!baseSlug) {
        return next(new Error("Invalid name format"));
      }

      let slugCandidate = baseSlug;
      let attempt = 0;
      const maxAttempts = 10;

      while (attempt < maxAttempts) {
        const existingUser = await model("Users").findOne({
          slug: slugCandidate,
        });
        if (!existingUser) {
          this.slug = slugCandidate;
          break;
        }

        attempt++;
        const suffix = Math.random().toString(36).substring(2, 6);
        slugCandidate = `${baseSlug}-${suffix}`;
      }

      if (!this.slug) {
        return next(
          new Error(
            "Unable to create a unique profile URL. Please try a different name."
          )
        );
      }
    }

    next();
  } catch (error) {
    console.error("Error generating slug:", error);
    next(
      error instanceof Error ? error : new Error("Failed to process user data")
    );
  }
});

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
      error instanceof Error ? error : new Error("Failed to process user data")
    );
  }
});

usersSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// Virtual for full profile URL
usersSchema.virtual("profileUrl").get(function () {
  return `https://sitterspots.com/${this.slug}`;
});

export const Users = model<IUser>("Users", usersSchema);
