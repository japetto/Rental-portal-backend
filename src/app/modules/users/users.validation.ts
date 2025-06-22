import { z } from "zod";
import { SourceWebsiteEnums, UserRoleEnums } from "./user.constant";

const usersZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "User Name is Required",
    }),
    email: z
      .string({
        required_error: "Email is Required",
      })
      .email("Please use a valid email address"),
    password: z.string({
      required_error: "Password is Required",
    }),
    profileImage: z
      .string()
      .default("https://i.ibb.co/dcHVrp8/User-Profile-PNG-Image.png"),
    role: z
      .enum([...UserRoleEnums] as [string, ...string[]], {
        required_error: "Role is Required",
      })
      .default("TENANT"),
    sourceWebsite: z
      .enum([...SourceWebsiteEnums] as [string, ...string[]])
      .default("direct"),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is Required",
      })
      .email("Please use a valid email address"),
    password: z.string({
      required_error: "Password is Required",
    }),
  }),
});

const userUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    contactNumber: z.string().optional(),
    password: z.string().optional(),
    profileImage: z.string().optional(),
    role: z.string().optional(),
    uid: z.string().optional(),
    location: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  }),
});

const updatePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: "Current Password is Required",
    }),
    newPassword: z
      .string({
        required_error: "New Password is Required",
      })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string({
      required_error: "Confirm Password is Required",
    }),
    userId: z.string({
      required_error: "User ID is Required",
    }),
  }),
});

export const UserValidation = {
  usersZodSchema,
  loginUserZodSchema,
  userUpdateZodSchema,
  updatePasswordZodSchema,
};
