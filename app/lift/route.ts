// app/api/lift/route.ts
import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// Filtrer les lifts en fonction du type demandé
export async function GET(req: Request) {
    const url = new URL(req.url);
    const typeQuery = url.searchParams.get("type");  // Récupérer le type depuis l'URL

    try {
        let lifts;
        if (typeQuery) {
            // Filtrer par type (par exemple "di" pour dips)
            lifts = await prisma.lift.findMany({
                where: {
                    type: typeQuery,  // Filtrer par type (par exemple "di" pour dips)
                },
            });
        } else {
            lifts = await prisma.lift.findMany();  // Sinon, récupérer tous les lifts
        }

        return NextResponse.json(lifts);
    } catch {
        return NextResponse.error();
    }
}
