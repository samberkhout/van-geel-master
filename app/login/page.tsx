"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            redirect: true,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    if (status === "loading") {
        return <p className="text-center mt-10">Laden...</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                   <Image src="/logo.png" alt="Logo" width={192} height={48} className="w-24 h-auto" />
                </div>

                <h2 className="text-2xl font-bold text-black text-center mb-6">Inloggen</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-black">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-black">Wachtwoord</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 text-black"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Bezig met inloggen..." : "Inloggen"}
                    </button>
                </form>

                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

            </div>
        </div>
    );
}
