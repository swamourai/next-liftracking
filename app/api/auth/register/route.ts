import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/src/schemas/userSchema";
import prisma from "@/src/lib/prisma";

// Handler pour la méthode POST
export async function POST(req: Request) {
  try {
    // Parse et valider les données du body
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
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
        gender: data.gender
      },
    });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 400 });
  }
}
