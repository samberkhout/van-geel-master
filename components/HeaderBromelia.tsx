﻿"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {

    const { data: session } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const activeLinkClass = (href: string) =>
        pathname === href
            ? "hover:underline bg-gray-500 text-white md:px-2 md:py-1 md:rounded-xl"
            : "hover:underline"


    return (
        <header className="bg-green-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={192} height={48} className="w-24 h-auto" />
                </Link>

                {/* Desktop navigatie */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/bromelia" className={activeLinkClass("/")}>
                        Home
                    </Link>
                    <Link href="/bromelia/gasInvoer" className={activeLinkClass("/")}>
                        Gas Invoer
                    </Link>
                    {session?.user?.role === "ADMIN" && (
                    <div className="relative group">
                        <button className=" text-white px-4 py-2 rounded-md">
                            beheer ▼
                        </button>
                        <div
                            className="absolute right-0 top-full w-48 bg-white text-black shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-auto">
                            <ul className="py-2">
                                <li>
                                    <Link href="/admin/beheer/leveranciers"
                                          className="block px-4 py-2 hover:bg-gray-200">
                                        leveranciers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/beheer/soorten" className="block px-4 py-2 hover:bg-gray-200">
                                        soorten
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                    href="/admin/beheer/accounts"
                                    className="block px-4 py-2 hover:bg-gray-200">
                                        accounts
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                        )}


                    {session?.user ? (
                        <div className="relative group">
                            <button className="bg-white text-green-800 px-4 py-2 rounded-md">
                                Account ▼
                            </button>
                            <div
                                className="absolute right-0 top-full w-48 bg-white text-black shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-auto">
                                <ul className="py-2">
                                    <li>
                                        <Link href="/account" className="block px-4 py-2 hover:bg-gray-200">
                                            Accountgegevens
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                        >
                                            Uitloggen
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="bg-white text-green-800 px-4 py-2 rounded-md">
                            Inloggen
                        </Link>
                    )}
                </nav>

                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-3xl focus:outline-none"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav className="md:hidden bg-green-700 px-6 py-4 space-y-2">
                    <Link
                        href="/bromelia"
                        className="block hover:bg-green-600 px-4 py-2 rounded-md"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                        </Link>
                    <Link href="/bromelia/gasInvoer" className={activeLinkClass("/")} onClick={() => setMenuOpen(false)}>
                        Gas Invoer
                    </Link>
                    {session?.user?.role === "ADMIN" && (
                        <div>
                            <button
                                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                                className="w-full  text-white px-4 py-2 rounded-md flex justify-between"
                            >
                                admin ▼
                            </button>
                            {adminMenuOpen && (
                                <div className="mt-2 bg-white text-black shadow-lg rounded-md">
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                href="/admin/beheer/leveranciers"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                leveranciers
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/admin/beheer/soorten"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                soorten
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/admin/beheer/accounts"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                                onClick={() => setMenuOpen(false)}
                                                >
                                                accounts
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {session?.user ? (
                        <div>
                            <button
                                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                className="w-full bg-white text-green-800 px-4 py-2 rounded-md flex justify-between"
                            >
                                Account ▼
                            </button>
                            {accountMenuOpen && (
                                <div className="mt-2 bg-white text-black shadow-lg rounded-md">
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                href="/account"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Accountgegevens
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                            >
                                                Uitloggen
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="block bg-white text-green-800 px-4 py-2 rounded-md"
                            onClick={() => setMenuOpen(false)}
                        >
                            Inloggen
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}
