import { z } from "zod";

export const liftNames = ["dips", "pull-up", "muscle-up", "squat"] as const; 
export const liftNameSchema = z.enum(liftNames);

export type liftNameType = z.infer<typeof liftNameSchema>;