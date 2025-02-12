'use server'

import { PrismaClient } from "@prisma/client";
import {revalidatePath} from "next/cache";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function deleteLeverancier(id: number) {

    await prisma.leverancier.delete({
        where: {id}
    });

    revalidatePath("admin/beheer/leverancier");
}
export async function addLeverancier(naam: string) {
    await prisma.leverancier.create({
        data: { naam },
    });
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
    await prisma.soort.delete({
        where: {id}
    })
    revalidatePath("admin/beheer/soorten");
}

export async function getSoorten() {
    return prisma.soort.findMany();
}
export async function addSoort(naam: string, leverancierId: number) {
    await prisma.soort.create({
        data: { naam, leverancierId },
    });
    revalidatePath("admin/beheer/soorten");
}
export async function updateSoort(id: number, naam: string, leverancierId: number) {
    await prisma.soort.update({
        where: {id},
        data:{
            naam,
            leverancierId
        }
    })
    revalidatePath("admin/beheer/soorten");
}
export async function getUsers() {
    return prisma.user.findMany();
}

export async function addUser(name: string, email: string, password: string, rol: string) {
    rol = (rol === "Beheerder") ? "ADMIN" : "USER";

    password = await bcrypt.hash(password, rol);
    await prisma.user.create({
        data: {
            name,
            email,
            password,
            rol: rol as "USER" | "ADMIN", // Typecasting naar enum waarde
        },
    });
    revalidatePath("admin/beheer/accounts");
}

export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: { id },
    });
    revalidatePath("admin/beheer/accounts");
}
export async function updateUser(id: string, name: string, email: string, rol: string, password?: string) {
    rol = (rol === "Beheerder") ? "ADMIN" : "USER";

    if (password && password.trim() !== "") {
        password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            password,
            rol: rol as "USER" | "ADMIN",
        },
    });

    revalidatePath("admin/beheer/accounts");
}
export async function addOppotten(leverweek: number, ras: string, aantalOpgepot: number, aantalWeggooi: number, redenWeggooi: string, andereReden?: string){

    await prisma.oppotten.create({
        data: {
            leverweek,
            ras,
            aantalOpgepot,
            aantalWeggooi,
            redenWeggooi,
            andereReden,
    }}
    )
}
export async function addScouting(leverweek: number, ras: string, oppotweek: number, bio: number, oorwoorm: boolean) {
    await prisma.scout.create({
        data: {
            leverweek,
            ras,
            oppotweek,
            bio,
            oorwoorm,
        }
    })
}
export async function addTrips(soort: string, leverweek: number, oppotweek:number, aantalPlanten: number, locatie:string) {
    await prisma.trips.create({
        data: {
            soort,
            leverweek,
            oppotweek,
            aantalPlanten,
            locatie,
        }
    })
}
export async function addZiekZoeken(leverweek: number, ras: string, aantalWeggooi: number, redenWeggooi:string, andereReden?: string) {
    await prisma.ziekZoeken.create({
        data: {
            leverweek,
            ras,
            aantalWeggooi,
            redenWeggooi,
            andereReden,
        }
    })
}


