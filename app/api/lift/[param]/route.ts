import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Prisma } from '@prisma/client'
import { liftWithIdSchema } from "@/src/schemas/liftSchema";
import { z } from "zod";
import { liftNameSchema } from "@/src/schemas/liftNameSchema";

export async function GET(req: Request, { params }: { params: { param: string } }) {
    const { param } = params;
    if (!isNaN(Number(param))) {
      const id = param
      try {
          const lift = await prisma.lift.findUnique({
            where: { id: parseInt(id, 10) }, // Convertir l'ID en nombre
          });
      
          if (!lift) {
            return NextResponse.json({ error: "Lift not found" }, { status: 404 });
          }
      
          return NextResponse.json(lift);
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);  // Utilisation des propriétés de l'erreur
          }
          return NextResponse.error();
        }
    } else {
      try {
        liftNameSchema.parse(param); // Valide si `param` est dans l'enum

        const lifts = await prisma.lift.findMany({
            where: { type: param },
        });

        return NextResponse.json(lifts);
      } catch {
          return NextResponse.json({ error: "Invalid lift type" }, { status: 400 });
      }
    }
}

export async function DELETE(req: Request, { params }: { params: { param: string } }) {
  const { param } = params;

  if (!isNaN(Number(param))) {
    const id = param;
    try {
      const deletedLift = await prisma.lift.delete({
        where: { id: parseInt(id, 10) },
      });
  
      return NextResponse.json(deletedLift);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        // Gestion des erreurs Prisma (P2025 = Enregistrement non trouvé)
        return NextResponse.json({ error: "Lift not found" }, { status: 404 });
      }
      return NextResponse.error();
    }
  }
  return NextResponse.json({ error: "DELETE is only supported for IDs" }, { status: 400 });
}

export async function PUT(req: Request, { params }: { params: { param: string } }) {
  const { param } = params;
  if (!isNaN(Number(param))) {
    const id = param;
    try {
        const body = await req.json();
        const parsed = liftWithIdSchema.parse(body); // Validation

        const updatedLift = await prisma.lift.update({
            where: {
                id: Number(id), // Utilisation de l'ID pour mettre à jour
            },
            data: parsed, // Les nouvelles données à mettre à jour
        });

        return NextResponse.json(updatedLift); // Retourner le lift mis à jour
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.error();
    }
  }
  return NextResponse.json({ error: "Erreur 400" }, { status: 400 });
}