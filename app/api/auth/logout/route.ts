// /pages/api/logout/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/iron-session";

export async function POST() {
  const session = await getSession();
  session.destroy(); // Détruire la session
  return NextResponse.json({ message: "Logged out successfully" });
}
