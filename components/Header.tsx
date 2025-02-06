'use client';

import { useState } from "react";
import Link from "next/link";
import { useLanguage, Language } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export default function Header() {
    const { language, setLanguage } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };

    // Als de link actief is, krijgt deze:
    // - op mobiele apparaten: alleen een grijze achtergrond en witte tekst.
    // - op desktop (md): extra padding en afgeronde hoeken.
    const activeLinkClass = (href: string) =>
        pathname === href
            ? "hover:underline bg-gray-500 text-white md:px-2 md:py-1 md:rounded-xl"
            : "hover:underline";

    return (
        <header className="bg-green-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <img src="/logo.png" alt="Logo" className="w-40" />
                </Link>

                {/* Desktop navigatie en taalkeuze */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/" className={activeLinkClass("/")}>
                        Home
                    </Link>
                    <Link href="/oppotten" className={activeLinkClass("/oppotten")}>
                        Oppotten
                    </Link>
                    <Link href="/trips" className={activeLinkClass("/trips")}>
                        Trips
                    </Link>
                    <Link href="/ziek-zoeken" className={activeLinkClass("/ziek-zoeken")}>
                        Ziek Zoeken
                    </Link>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => changeLanguage("nl")}
                            className={`px-2 py-1 border rounded ${
                                language === "nl" ? "bg-white text-green-800" : "bg-green-800 text-white"
                            }`}
                        >
                            NL
                        </button>
                        <button
                            onClick={() => changeLanguage("en")}
                            className={`px-2 py-1 border rounded ${
                                language === "en" ? "bg-white text-green-800" : "bg-green-800 text-white"
                            }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => changeLanguage("pl")}
                            className={`px-2 py-1 border rounded ${
                                language === "pl" ? "bg-white text-green-800" : "bg-green-800 text-white"
                            }`}
                        >
                            PL
                        </button>
                    </div>
                </nav>

                {/* Mobiele menu knop */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-3xl focus:outline-none"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobiele navigatie (wordt alleen getoond als menuOpen true is) */}
            {menuOpen && (
                <nav className="md:hidden bg-green-700 px-6 py-4 space-y-2">
                    <Link
                        href="/"
                        className={`block ${activeLinkClass("/")}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/oppotten"
                        className={`block ${activeLinkClass("/oppotten")}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Oppotten
                    </Link>
                    <Link
                        href="/trips"
                        className={`block ${activeLinkClass("/trips")}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Trips
                    </Link>
                    <Link
                        href="/ziek-zoeken"
                        className={`block ${activeLinkClass("/ziek-zoeken")}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Ziek Zoeken
                    </Link>
                    <div className="flex space-x-2 pt-2">
                        <button
                            onClick={() => {
                                changeLanguage("nl");
                                setMenuOpen(false);
                            }}
                            className={`px-2 py-1 border rounded ${
                                language === "nl" ? "bg-white text-green-800" : "bg-green-700 text-white"
                            }`}
                        >
                            NL
                        </button>
                        <button
                            onClick={() => {
                                changeLanguage("en");
                                setMenuOpen(false);
                            }}
                            className={`px-2 py-1 border rounded ${
                                language === "en" ? "bg-white text-green-800" : "bg-green-700 text-white"
                            }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => {
                                changeLanguage("pl");
                                setMenuOpen(false);
                            }}
                            className={`px-2 py-1 border rounded ${
                                language === "pl" ? "bg-white text-green-800" : "bg-green-700 text-white"
                            }`}
                        >
                            PL
                        </button>
                    </div>
                </nav>
            )}
        </header>
    );
}
