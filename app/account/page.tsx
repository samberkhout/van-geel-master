"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect naar login als gebruiker niet is ingelogd
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p className="text-center mt-10">Laden...</p>;
    }

    return (
        <div className="min-h-screen bg-green-100">
            <Header />
            <div className="flex items-center justify-center pt-10">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
                    <h2 className="text-2xl font-bold text-center mb-6">Mijn Account</h2>

                    <div className="mb-4 text-center">
                        <p className="text-lg font-semibold">{session?.user?.name}</p>
                        <p className="text-gray-600">{session?.user?.email}</p>
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                    >
                        Uitloggen
                    </button>
                </div>
            </div>
        </div>
    );
}
