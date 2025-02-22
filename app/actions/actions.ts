'use server'

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function getOrCreatePlant(leverweek: number, soortId: number) {

    let plant = await prisma.plant.findFirst({ where: { leverweek, soortId } });
   console.log(plant);
    if (!plant) {
        plant = await prisma.plant.create({
            data: { leverweek, soortId },
        });
    }

    return plant.id;
}

export async function deleteLeverancier(id: number) {
    await prisma.leverancier.delete({ where: { id } });
    revalidatePath("admin/beheer/leverancier");
}

export async function addLeverancier(naam: string) {
    await prisma.leverancier.create({ data: { naam } });
    revalidatePath("admin/beheer/leverancier");
}

export async function getLeveranciers() {
    return prisma.leverancier.findMany();
}

export async function updateLeverancier(id: number, naam: string) {
    await prisma.leverancier.update({
        where: { id },
        data: { naam },
    });
    revalidatePath("admin/beheer/leverancier");
}

export async function deleteSoort(id: number) {
    await prisma.soort.delete({ where: { id } });
    revalidatePath("admin/beheer/soorten");
}

export async function getSoorten() {
    return prisma.soort.findMany();
}

export async function addSoort(naam: string, leverancierId: number) {
    await prisma.soort.create({ data: { naam, leverancierId } });
    revalidatePath("admin/beheer/soorten");
}

export async function updateSoort(id: number, naam: string, leverancierId: number) {
    await prisma.soort.update({
        where: { id },
        data: { naam, leverancierId },
    });
    revalidatePath("admin/beheer/soorten");
}

export async function getUsers() {
    return prisma.user.findMany();
}

export async function addUser(name: string, email: string, password: string, rol: string) {
    rol = rol === "Beheerder" ? "ADMIN" : "USER";
    password = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { name, email, password, rol: rol as "USER" | "ADMIN" },
    });

    revalidatePath("admin/beheer/accounts");
}

export async function deleteUser(id: string) {
    await prisma.user.delete({ where: { id } });
    revalidatePath("admin/beheer/accounts");
}

export async function updateUser(id: string, name: string, email: string, rol: string, password?: string) {
    rol = rol === "Beheerder" ? "ADMIN" : "USER";

    const data: Partial<{ name: string, email: string, password: string, rol: "USER" | "ADMIN" }> = { name, email, rol: rol as "USER" | "ADMIN" };

    if (password && password.trim() !== "") {
        data.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({ where: { id }, data });
    revalidatePath("admin/beheer/accounts");
}

export async function addOppotten(leverweek: number, soortNaam: string, aantalOpgepot: number, aantalWeggooi: number, redenWeggooi: string, andereReden?: string) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam} });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);

    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.oppotten.create({
        data: {
            plantId,
            leverweek,
            soortId: soort.id,
            aantalOpgepot,
            aantalWeggooi,
            redenWeggooi,
            andereReden,
        },
    });
}

export async function addScouting(leverweek: number, soortNaam: string, oppotweek: number, bio: number, oorwoorm: boolean) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);

    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.scout.create({
        data: {
            plantId,
            soortId: soort.id,
            leverweek,
            oppotweek,
            bio,
            oorwoorm,
        },
    });
}

export async function addTrips(soortNaam: string, leverweek: number, oppotweek: number, aantalPlanten: number, locatie: { x: number; y: number }) {
    if (locatie.x < 0 || locatie.x > 20 || locatie.y < 0 || locatie.y > 20) {
        throw new Error("Locatie-coördinaten moeten tussen 0 en 20 liggen.");
    }

    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);

    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.trips.create({
        data: {
            plantId,
            soortId: soort.id,
            leverweek,
            oppotweek,
            aantalPlanten,
            locatie,
        },
    });
}

export async function addZiekZoeken(leverweek: number, soortNaam: string, aantalWeggooi: number, redenWeggooi: string, andereReden?: string) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam }});
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);

    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.ziekZoeken.create({
        data: {
            plantId,
            soortId: soort.id,
            leverweek,
            aantalWeggooi,
            redenWeggooi,
            andereReden,
        },
    });
}

export async function updateTrips(
    id: number,
    soortNaam: string,
    leverweek: number,
    oppotweek: number,
    aantalPlanten: number,
    locatie: { x: number; y: number }
) {
    if (locatie.x < 0 || locatie.x > 20 || locatie.y < 0 || locatie.y > 20) {
        throw new Error("Locatie-coördinaten moeten tussen 0 en 20 liggen.");
    }
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);
    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.trips.update({
        where: { id },
        data: {
            plantId,
            leverweek,
            oppotweek,
            aantalPlanten,
            locatie,
            soortId: soort.id,
        },
    });
    revalidatePath("/"); // Pas aan indien nodig
}

export async function updateOppotten(
    id: number,
    soortNaam: string,
    leverweek: number,
    aantalOpgepot: number,
    aantalWeggooi: number,
    redenWeggooi: string,
    andereReden?: string
) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);
    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.oppotten.update({
        where: { id },
        data: {
            plantId,
            leverweek,
            aantalOpgepot,
            aantalWeggooi,
            redenWeggooi,
            andereReden,
            soortId: soort.id,
        },
    });
    revalidatePath("/");
}

export async function updateScouting(
    id: number,
    soortNaam: string,
    leverweek: number,
    oppotweek: number,
    bio: number,
    oorwoorm: boolean
) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);
    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.scout.update({
        where: { id },
        data: {
            plantId,
            leverweek,
            oppotweek,
            bio,
            oorwoorm,
            soortId: soort.id,
        },
    });
    revalidatePath("/");
}

export async function updateZiekZoeken(
    id: number,
    soortNaam: string,
    leverweek: number,
    aantalWeggooi: number,
    redenWeggooi: string,
    andereReden?: string
) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);
    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.ziekZoeken.update({
        where: { id },
        data: {
            plantId,
            leverweek,
            aantalWeggooi,
            redenWeggooi,
            andereReden,
            soortId: soort.id,
        },
    });
    revalidatePath("/");
}


export async function getQSMgroei() {
    return prisma.qSMgroei.findMany();
}
export async function getTodayEntries() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trips = await prisma.trips.findMany({
        where: { createdAt: { gte: today } },
        select: {
            id: true,
            leverweek: true,
            oppotweek: true,
            aantalPlanten: true,
            locatie: true, // Dit is een JsonValue (kan null zijn)
            soort: { select: { naam: true } },
        },
    });

    const oppotten = await prisma.oppotten.findMany({
        where: { createdAt: { gte: today } },
        select: {
            id: true,
            leverweek: true,
            aantalOpgepot: true,
            aantalWeggooi: true,
            redenWeggooi: true,
            andereReden: true,
            soort: { select: { naam: true } },
        },
    });

    const scouting = await prisma.scout.findMany({
        where: { createdAt: { gte: today } },
        select: {
            id: true,
            leverweek: true,
            oppotweek: true,
            bio: true,
            oorwoorm: true,
            soort: { select: { naam: true } },
        },
    });

    const ziekZoeken = await prisma.ziekZoeken.findMany({
        where: { createdAt: { gte: today } },
        select: {
            id: true,
            leverweek: true,
            aantalWeggooi: true,
            redenWeggooi: true,
            andereReden: true,
            soort: { select: { naam: true } },
        },
    });

    return [
        ...trips.map((t) => ({
            id: t.id,
            type: "Trips" as const,
            leverweek: t.leverweek,
            ras: t.soort.naam,
            extraInfo: `Planten: ${t.aantalPlanten}`,
            oppotweek: t.oppotweek,
            aantalPlanten: t.aantalPlanten,
            // Controleer of locatie een object is en cast het anders naar undefined
            locatie:
                t.locatie && typeof t.locatie === "object"
                    ? (t.locatie as { x: number; y: number })
                    : undefined,
        })),
        ...oppotten.map((o) => ({
            id: o.id,
            type: "Oppotten" as const,
            leverweek: o.leverweek,
            ras: o.soort.naam,
            extraInfo: `Opgepot: ${o.aantalOpgepot}`,
            aantalOpgepot: o.aantalOpgepot,
            aantalWeggooi: o.aantalWeggooi,
            redenWeggooi: o.redenWeggooi,
            // Zorg ervoor dat we een lege string geven als andereReden null is
            andereReden: o.andereReden || "",
        })),
        ...scouting.map((s) => ({
            id: s.id,
            type: "Scouting" as const,
            leverweek: s.leverweek,
            ras: s.soort.naam,
            extraInfo: `Bio: ${s.bio}`,
            oppotweek: s.oppotweek,
            bio: s.bio,
            oorwoorm: s.oorwoorm,
        })),
        ...ziekZoeken.map((z) => ({
            id: z.id,
            type: "Ziek zoeken" as const,
            leverweek: z.leverweek,
            ras: z.soort.naam,
            extraInfo: `Weggooi: ${z.aantalWeggooi}`,
            aantalWeggooi: z.aantalWeggooi,
            redenWeggooi: z.redenWeggooi,
            andereReden: z.andereReden || "",
        })),
    ];
}





export async function deleteEntry(id: number, type: string) {
    switch (type) {
        case "Trips":
            await prisma.trips.delete({ where: { id } });
            break;
        case "Oppotten":
            await prisma.oppotten.delete({ where: { id } });
            break;
        case "Scouting":
            await prisma.scout.delete({ where: { id } });
            break;
        case "Ziek zoeken":
            await prisma.ziekZoeken.delete({ where: { id } });
            break;
        default:
            throw new Error("Ongeldig type voor verwijdering.");
    }
}
export async function getHeatmapData() {
    const data = await prisma.trips.findMany({
        select: {
            locatie: true,
            aantalPlanten: true,
        },
    });

    // Maak een 20x20 grid met aantallen planten per locatie
    const heatmap = Array.from({ length: 20 }, () =>
        Array(20).fill(0)
    );

    data.forEach(({ locatie, aantalPlanten }) => {
        if (locatie && typeof locatie === "object") {
            const { x, y } = locatie as { x: number; y: number };
            if (x >= 1 && x <= 20 && y >= 1 && y <= 20) {
                heatmap[y - 1][x - 1] += aantalPlanten; // -1 omdat arrays op 0-based index werken
            }
        }
    });

    return heatmap;
}
// Voeg deze functies toe in actions.ts

export async function getTripsEntriesExport() {
    return prisma.trips.findMany({
        select: {
            id: true,
            leverweek: true,
            oppotweek: true,
            aantalPlanten: true,
            locatie: true,
            createdAt: true,
            soort: {
                select: {
                    naam: true,
                    leverancier: {
                        select: { naam: true },
                    },
                },
            },
        },
    });
}

export async function getOppottenEntriesExport() {
    return prisma.oppotten.findMany({
        select: {
            id: true,
            leverweek: true,
            aantalOpgepot: true,
            aantalWeggooi: true,
            redenWeggooi: true,
            andereReden: true,
            createdAt: true,
            soort: {
                select: {
                    naam: true,
                    leverancier: {
                        select: { naam: true },
                    },
                },
            },
        },
    });
}

export async function getScoutingEntriesExport() {
    return prisma.scout.findMany({
        select: {
            id: true,
            leverweek: true,
            oppotweek: true,
            bio: true,
            oorwoorm: true,
            createdAt: true,
            soort: {
                select: {
                    naam: true,
                    leverancier: {
                        select: { naam: true },
                    },
                },
            },
        },
    });
}

export async function getZiekZoekenEntriesExport() {
    return prisma.ziekZoeken.findMany({
        select: {
            id: true,
            leverweek: true,
            aantalWeggooi: true,
            redenWeggooi: true,
            andereReden: true,
            createdAt: true,
            soort: {
                select: {
                    naam: true,
                    leverancier: {
                        select: { naam: true },
                    },
                },
            },
        },
    });
}

export async function addLevering(soortNaam: string, leverweek: number, gasweek: number, aantal: number) {
    const soort = await prisma.soort.findFirst({ where: { naam: soortNaam } });
    if (!soort) throw new Error(`Soort ${soortNaam} bestaat niet.`);

    const plantId = await getOrCreatePlant(leverweek, soort.id);

    await prisma.gas.create({
        data: {
            plantId,
            soortId: soort.id,
            leverweek,
            gasweek,
            aantal,
        },
    });

    revalidatePath("/gasInvoer");
}






