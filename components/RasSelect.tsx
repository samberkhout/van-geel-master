"use client";

import React, { useState, useEffect, useRef } from "react";
import { getSoorten } from "@/app/actions/actions";

interface Soort {
    id: number;
    naam: string;
}


interface RasSelectProps {
    value: string;
    onChangeAction: (name: string, value: string) => void;
}

export default function RasSelect({ value, onChangeAction }: RasSelectProps) {
    const [rassen, setRassen] = useState<Soort[]>([]);
    const [search, setSearch] = useState<string>(value || "");
    const [filteredRassen, setFilteredRassen] = useState<Soort[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchRassen() {
            try {
                const data: Soort[] = await getSoorten();
                setRassen(data);
                setFilteredRassen(data);
            } catch (error) {
                console.error("Error fetching rassen:", error);
            }
        }
        fetchRassen();
    }, []);

    useEffect(() => {
        setFilteredRassen(
            rassen.filter((ras) =>
                ras.naam.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, rassen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (selectedRas: string) => {
        setSearch(selectedRas);
        onChangeAction("ras", selectedRas);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <input
                type="text"
                placeholder="Zoek en selecteer een ras..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsOpen(true)}
                className="border p-2 w-full rounded-md"
            />
            {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
                    {filteredRassen.length > 0 ? (
                        filteredRassen.map((ras) => (
                            <li
                                key={ras.id}
                                onClick={() => handleSelect(ras.naam)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {ras.naam}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">Geen resultaten</li>
                    )}
                </ul>
            )}
        </div>
    );
}

