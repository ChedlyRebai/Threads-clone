import * as z from "zod";

export const UserValidation = z.object({
  profilePhoto: z.string().url().nonempty(),
  name: z
    .string()
    .min(7, { message: "Name must be at least 7 characters long" })
    .nonempty()
    .max(25, { message: "Name must be at most 25 characters long" }),
  username: z
    .string()
    .min(7, { message: "Username must be at least 7 characters long" })
    .nonempty(),
  bio: z.string().max(100, { message: "bio be at most 100 characters long" }),
});
