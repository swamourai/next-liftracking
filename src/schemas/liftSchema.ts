import { z } from "zod";
import { liftNames } from "./liftNameSchema";

export const liftSchema = z.object({
  rpe: z
    .number()
    .min(1, { message: "RPE doit être au moins 1" })
    .max(10, { message: "RPE doit être entre 1 et 10" }),
  rep: z
    .number()
    .min(1, { message: "Le nombre de répétitions doit être au moins 1" }),
  serie: z
    .number()
    .min(1, { message: "Le nombre de séries doit être au moins 1" }),
  weight: z
    .number()
    .positive({ message: "Le poids doit être un nombre positif" }),
  userId: z
    .number()
    .min(1, { message: "Un ID utilisateur valide est requis" }),
  type: z
    .string()
    .min(1, { message: "Veuillez définir le type de lift" })
    .refine((val) => liftNames.includes(val as typeof liftNames[number]), {
      message: "Type de lift invalide",
    }),
  date: z.coerce.date(),
  comment: z
    .string()
    .max(500, { message: "Le commentaire doit contenir au maximum 500 caractères" })
    .nullable()
    .optional(),
  failure: z.boolean().nullable().optional(),
  failureSerie: z
    .number()
    .min(1, { message: "Le nombre de séries d'échec doit être au moins 1" })
    .nullable()
    .optional(),
  failureRep: z
    .number()
    .min(1, { message: "Le nombre de répétitions d'échec doit être au moins 1" })
    .nullable()
    .optional(),
});

export const liftWithIdSchema = liftSchema.extend({
  id: z
    .number()
    .min(1, { message: "L'ID du lift doit être un entier positif" }),
});

export type Lift = z.infer<typeof liftSchema>;
export type LiftWithId = z.infer<typeof liftWithIdSchema>;
