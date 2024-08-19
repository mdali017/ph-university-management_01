import { z } from "zod";

const userValidationSchema = z.object({
  //   id: z.string(),
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .max(10, { message: "password can to be 10 words" })
    .optional(),
//   needPasswordChange: z.boolean().default(true).optional(),
//   role: z.enum(["student", "faculty", "admin"]),
//   status: z.enum(["in-progress", "blocked"]).default("in-progress"),
//   isDeleted: z.boolean().default(false).optional(),
});

export default userValidationSchema;
