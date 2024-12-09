import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/src/schemas/userSchema";
import prisma from "@/src/lib/prisma";
import { getSession } from "@/src/lib/iron-session";

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

    // Créer la session de l'utilisateur après l'enregistrement
    const session = await getSession(); // Récupérer la session existante
    session.isLoggedIn = true; // Marquer l'utilisateur comme connecté
    session.email = user.email; // Stocker l'email de l'utilisateur dans la session
    session.userId = user.id; // Stocker l'ID de l'utilisateur dans la session
    await session.save(); // Sauvegarder la session

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 400 });
  }
}
