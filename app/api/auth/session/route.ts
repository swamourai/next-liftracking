// /pages/api/session/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/iron-session";

export async function GET() {
  const session = await getSession();

  // Vérifie si la session existe, si non on renvoie un isLoggedIn false
  if (!session || !session.isLoggedIn) {
    return NextResponse.json({
      isLoggedIn: false,
      userId: null,
      email: null,
    });
  }

  // Renvoie les données de session
  return NextResponse.json({
    isLoggedIn: session.isLoggedIn,
    userId: session.userId,
    email: session.email,
  });
}
