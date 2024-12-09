import { z } from "zod";

export const genderSchema = z.enum(["homme", "femme"]).optional();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Le mot de passe doit être au moins de 6" }),
});

export const registerSchema = loginSchema.extend({
    username: z.string(),
    weight: z.number().min(1).optional(),
    birthday: z.coerce.date().refine((data) => data < new Date(), { message: "Vous ne pouvez pas être né dans le futur.." }).optional(),
    gender: genderSchema
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;