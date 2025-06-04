import { z } from "zod";

export const FormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type FormSchemaType = z.infer<typeof FormSchema>;


export const loginSchema = z.object({
  phone: z.string().min(1, "Phone is required").regex(/^\d{9,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export const FormSchemaChangePassword = z
  .object({
    old_password: z.string().min(6, "Old password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    new_password_confirmation: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
  });

export type FormSchemaTypeChangePassword = z.infer<typeof FormSchemaChangePassword>;