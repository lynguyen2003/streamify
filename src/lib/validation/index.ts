import * as z from "zod";

// ============================================================
// USER
// ============================================================

export const UserValidation = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string(),
  imageUrl: z.string(),
  bio: z.string(),
  posts: z.array(z.string()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const UpdateUserSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string(),
  bio: z.string(),
  imageUrl: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(150, { message: "Maximum 150 characters" }),
  mediaUrls: z.array(z.string()),
  type: z.string(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.array(z.string()),
  mentions: z.array(z.string()),
  privacy: z.enum(["public", "private", "followers", "friends"]).default("public"),
});

export const ForgotPasswordValidation = z.object({
  email: z.string().email(),
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const ResetPasswordValidation = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
