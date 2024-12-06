// app/api/lift/route.ts
import prisma from "@/src/lib/prisma";
import { liftSchema, liftWithIdSchema } from "@/src/schemas/liftSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const lifts = await prisma.lift.findMany();
    return NextResponse.json(lifts);
  } catch {
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const parsed = liftSchema.parse(body); // Validation avec Zod
    const newLift = await prisma.lift.create({
      data: parsed,
    });

    return NextResponse.json(newLift);
  } catch {
    return NextResponse.error();
  }
}

// Route pour mettre à jour un lift existant
export async function PUT(req: Request) {
  try {
    // Extraire l'ID du body de la requête pour savoir quel lift mettre à jour
    const body = await req.json();
    
    // On s'assure que l'ID est présent dans la requête
    if (!body.id) {
      return NextResponse.json({ error: "L'ID est requis" }, { status: 400 });
    }
    
    // Validation des données avec Zod
    const parsed = liftWithIdSchema.parse(body);

    // Mise à jour du lift dans la base de données
    const updatedLift = await prisma.lift.update({
      where: {
        id: body.id,  // Utilisation de l'ID pour identifier l'élément à mettre à jour
      },
      data: parsed,  // On passe les nouvelles données à mettre à jour
    });

    return NextResponse.json(updatedLift);  // Retourner le lift mis à jour
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.error();
  }
}
