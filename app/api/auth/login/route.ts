import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/src/lib/prisma";
import { loginSchema } from "@/src/schemas/userSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // session here

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (err: unknown) {
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      // Pour les cas où l'erreur n'est pas une instance d'Error
      return NextResponse.json({ error:  "An unexpected error occurred" }, { status: 400 });
  }
}