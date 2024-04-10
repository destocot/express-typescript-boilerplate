import { z } from "zod";

const body = {
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" })
      .min(1, { message: "Email cannot be empty" })
      .max(255, { message: "Email cannot exceed 255 characters" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password cannot be empty" })
      .max(255, { message: "Password cannot exceed 255 characters" }),
  }),
};

const params = {
  params: z.object({
    id: z
      .string({
        required_error: "User ID is required",
      })
      .cuid2({ message: "Invalid User ID" }),
  }),
};

export const createUserSchema = z.object({
  ...body,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const retrieveUserSchema = z.object({
  ...params,
});

export type RetrieveUserSchema = z.infer<typeof retrieveUserSchema>;

const optionalBody = {
  body: body.body.partial().refine((body) => {
    return body.email || body.password;
  }),
};

export const updateUserSchema = z.object({
  ...params,
  ...optionalBody,
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const deleteUserSchema = z.object({
  ...params,
});

export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
