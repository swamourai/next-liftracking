"use server";
import prisma from "@/src/lib/prisma";

export async function getLifts() {
    try {
        const lifts = await prisma.lift.findMany();
        return lifts;
    } catch {
        throw new Error("Failed to fetch lifts.");
    }
}
