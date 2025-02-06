import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log(data);
        const tripsRecord = await prisma.trips.create({
            data: {
                soort: data.soort,
                leverweek: data.leverweek,
                oppotweek: data.oppotweek,
                aantalPlanten: data.aantalPlanten,
                locatie: data.locatie,
            },
        });

        return NextResponse.json(tripsRecord, { status: 201 });
    } catch (error) {
        console.error("Error inserting trips data:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden bij het opslaan van de data." },
            { status: 500 }
        );
    }
}
