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
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

export const ForgotPasswordValidation = z.object({
  email: z.string().email(),
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
