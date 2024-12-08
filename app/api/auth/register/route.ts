import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/src/schemas/userSchema";
import prisma from "@/src/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = registerSchema.parse(req.body);

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Créer un nouvel utilisateur
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          weight: data.weight,
          birthday: data.birthday ? new Date(data.birthday) : null,
        },
      });

      return res.status(201).json({ message: "User created successfully", user });
    } catch (err: unknown) {
        if (err instanceof Error) {
          return res.status(400).json({ error: err.message });
        }
        // Pour les cas où l'erreur n'est pas une instance d'Error
        return res.status(400).json({ error: "An unexpected error occurred" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
