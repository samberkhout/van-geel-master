import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// ✅ Breid de User en Session types uit
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role?: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        name: string;
        role?: string;
    }
}

// ✅ Breid de JWT types uit om `role` toe te voegen
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        name: string;
        role?: string;
    }
}
