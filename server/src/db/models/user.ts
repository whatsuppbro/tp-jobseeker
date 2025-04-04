import { z } from "zod";

export const UserModel = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["seeker", "company"]),
});

export type UserType = z.infer<typeof UserModel>;
