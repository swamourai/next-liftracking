import { z, ZodObject, ZodOptional, ZodRawShape } from "zod";

export const genderSchema = z.enum(["homme", "femme"]).optional();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Le mot de passe doit être au moins de 6" }),
});

export const registerSchema = loginSchema.extend({
    username: z.string().min(3, { message: "Le nom doit être au moins de 3" }),
    weight: z.coerce.number().min(1).optional(), // Convertit automatiquement en nombre
    birthday: z.coerce.date().refine((data) => data < new Date(), { message: "Vous ne pouvez pas être né dans le futur.." }).optional(),
    gender: genderSchema
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;


// Fonction qui récupère les champs obligatoires à partir du schéma ZodObject
export const getRequiredFields = <T extends ZodRawShape>(schema: ZodObject<T>) => {
    return Object.entries(schema.shape)
        .filter(([_, value]) => !(value instanceof ZodOptional)) // eslint-disable-line
        .map(([key]) => key); // Retourne les clés des champs obligatoires
};

