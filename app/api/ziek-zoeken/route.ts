// /app/api/ziek-zoeken/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const ziekZoekenRecord = await prisma.ziekZoeken.create({
            data: {
                leverweek: data.leverweek,
                ras: data.ras,
                aantalWeggooi: data.aantalWeggooi,
                redenWeggooi: data.redenWeggooi,
                andereReden: data.andereReden || null,
            },
        });

        return NextResponse.json(ziekZoekenRecord, { status: 201 });
    } catch (error) {
        console.error("Error inserting ziekZoeken data:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden bij het opslaan van de data." },
            { status: 500 }
        );
    }
}
