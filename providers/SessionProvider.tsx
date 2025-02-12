"use client"; // 🔥 Zorg ervoor dat dit een Client Component is

import { SessionProvider as NextAuthProvider } from "next-auth/react";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    return <NextAuthProvider>{children}</NextAuthProvider>;
}
