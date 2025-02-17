"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import SearchAndAddButton from "@/components/SearchAndAddButton";
import ItemList from "@/components/ItemList";
import { getTodayEntries, deleteEntry } from "@/app/actions/actions";

// Importeer de meegeleverde forms
import OppottenForm from "@/components/forms/oppotForm";
import ScoutForm from "@/components/forms/ScoutForm";
import TripsForm from "@/components/forms/tripsForm";
import ZiekZoekenForm from "@/components/forms/ziekZoekenForm";

interface Entry {
    id: number;
    type: "Trips" | "Oppotten" | "Scouting" | "Ziek zoeken";
    leverweek: number;
    ras: string;
    extraInfo: string;
    oppotweek?: number;
    aantalPlanten?: number;
    locatie?: { x: number; y: number };
    aantalOpgepot?: number;
    aantalWeggooi?: number;
    redenWeggooi?: string;
    andereReden?: string;
    bio?: number;
    oorwoorm?: boolean;
}


// Een eenvoudige modal container
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-96">
            {children}
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                Sluiten
            </button>
        </div>
    </div>
);

export default function TodayEntriesPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"Alles" | "Trips" | "Oppotten" | "Scouting" | "Ziek zoeken">("Alles");
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getTodayEntries();
            setEntries(data);
        }
        fetchData();
    }, []);

    async function handleDelete(id: number, type: string) {
        if (confirm(`Weet je zeker dat je deze ${type} invoer wilt verwijderen?`)) {
            await deleteEntry(id, type);
            setEntries((prev) => prev.filter((entry) => entry.id !== id || entry.type !== type));
        }
    }

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-black">
                <Header />
                <div className="container mx-auto px-6 py-10">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-6 text-center">Invoeren van vandaag</h1>
                        {/* Zoekbalk en filter-dropdown */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                                <SearchAndAddButton
                                    search={search}
                                    setSearch={setSearch}
                                    placeholder="Zoek op ras of type..."
                                    withMargin={false}
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value as "Alles" | "Trips" | "Oppotten" | "Scouting" | "Ziek zoeken")
                                }
                                className="border px-4 py-2 rounded-md bg-white text-black"
                            >
                                <option value="Alles">Alles</option>
                                <option value="Trips">Trips</option>
                                <option value="Oppotten">Oppotten</option>
                                <option value="Scouting">Scouting</option>
                                <option value="Ziek zoeken">Ziek Zoeken</option>
                            </select>
                        </div>
                        {/* Gefilterde lijst van invoeren */}
                        <ItemList
                            items={entries.filter(
                                (entry) =>
                                    (filter === "Alles" || entry.type === filter) &&
                                    (entry.ras.toLowerCase().includes(search.toLowerCase()) ||
                                        entry.type.toLowerCase().includes(search.toLowerCase()))
                            )}
                            getTitle={(entry) => `${entry.type} - ${entry.ras}`}
                            getSubtitle={(entry) => `Leverweek: ${entry.leverweek} | ${entry.extraInfo}`}
                            onEdit={(entry) => setEditingEntry(entry)}
                            onDelete={(id) => handleDelete(Number(id), filter)}
                        />
                    </div>
                </div>
               {editingEntry && (
                    <Modal onClose={() => setEditingEntry(null)}>
                        {editingEntry.type === "Trips" && (
                            <TripsForm
                                initialData={{
                                    id: editingEntry.id,
                                    ras: editingEntry.ras,
                                    leverweek: editingEntry.leverweek,
                                    oppotweek: editingEntry.oppotweek ?? 0,
                                    aantalPlanten: editingEntry.aantalPlanten ?? 0,
                                    locatie: editingEntry.locatie ?? { x: 0, y: 0 },
                                }}
                                onClose={() => setEditingEntry(null)}
                            />
                        )}
                        {editingEntry.type === "Oppotten" && (
                            <OppottenForm
                                initialData={{
                                    id: editingEntry.id,
                                    leverweek: editingEntry.leverweek,
                                    ras: editingEntry.ras,
                                    aantalOpgepot: editingEntry.aantalOpgepot ?? 0,
                                    aantalWeggooi: editingEntry.aantalWeggooi ?? 0,
                                    redenWeggooi: editingEntry.redenWeggooi ?? "",
                                    andereReden: editingEntry.andereReden ?? "",
                                }}
                                onClose={() => setEditingEntry(null)}
                            />
                        )}
                        {editingEntry.type === "Scouting" && (
                            <ScoutForm
                                initialData={{
                                    id: editingEntry.id,
                                    leverweek: editingEntry.leverweek,
                                    ras: editingEntry.ras,
                                    oppotweek: editingEntry.oppotweek ?? 0,
                                    bio: editingEntry.bio ?? 0,
                                    oorwoorm: editingEntry.oorwoorm ?? false,
                                }}
                                onClose={() => setEditingEntry(null)}
                            />
                        )}
                        {editingEntry.type === "Ziek zoeken" && (
                            <ZiekZoekenForm
                                initialData={{
                                    id: editingEntry.id,
                                    leverweek: editingEntry.leverweek,
                                    ras: editingEntry.ras,
                                    aantalWeggooi: editingEntry.aantalWeggooi ?? 0,
                                    redenWeggooi: editingEntry.redenWeggooi ?? "",
                                    andereReden: editingEntry.andereReden ?? "",
                                }}
                                onClose={() => setEditingEntry(null)}
                            />
                        )}
                    </Modal>
                )}
            </div>
        </ProtectedLayout>
    );
}
