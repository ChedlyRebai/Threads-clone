import * as z from "zod";

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(10, { message: "comment  must be at least  characters long" }),
});
