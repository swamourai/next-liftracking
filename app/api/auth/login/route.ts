import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/src/lib/prisma";
import { loginSchema } from "@/src/schemas/userSchema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = loginSchema.parse(req.body);

      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // session here

      return res.status(200).json({ message: "Login successful", user });
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