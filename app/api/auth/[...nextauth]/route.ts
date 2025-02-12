import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Vul een e-mail en wachtwoord in");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Geen gebruiker gevonden");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Verkeerd wachtwoord");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? "Naam onbekend",
                    role: user.rol ?? "USER"
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name ?? "Naam onbekend";
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name ?? "Naam onbekend";
            session.user.role = token.role ?? "USER";
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
