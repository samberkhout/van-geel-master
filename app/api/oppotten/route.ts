// /app/api/oppotten/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const oppottenRecord = await prisma.oppotten.create({
            data: {
                leverweek: data.leverweek,
                ras: data.ras,
                aantalOpgepot: data.aantalOpgepot,
                aantalWeggooi: data.aantalWeggooi,
                redenWeggooi: data.redenWeggooi,
                andereReden: data.andereReden || null,
            },
        });

        return NextResponse.json(oppottenRecord, { status: 201 });
    } catch (error) {
        console.error("Error inserting data:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden bij het opslaan van de data." },
            { status: 500 }
        );
    }
}
