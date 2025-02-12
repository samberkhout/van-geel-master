"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getSoorten, addSoort, deleteSoort, updateSoort } from "@/app/actions/actions";
import { getLeveranciers } from "@/app/actions/actions";

interface Soort {
    id: number;
    naam: string;
    leverancierId: number;
}

interface Leverancier {
    id: number;
    naam: string;
}

export default function SoortenPage() {
    const [soorten, setSoorten] = useState<Soort[]>([]);
    const [leveranciers, setLeveranciers] = useState<Leverancier[]>([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSoort, setSelectedSoort] = useState<Soort | null>(null);
    const [soortNaam, setSoortNaam] = useState("");
    const [leverancierId, setLeverancierId] = useState("");

    useEffect(() => {
        async function fetchData() {
            const soortenData = await getSoorten();
            const leveranciersData = await getLeveranciers();
            setSoorten(soortenData);
            setLeveranciers(leveranciersData);
        }
        fetchData();
    }, []);

    function getLeverancierNaam(leverancierId: number): string {
        const leverancier = leveranciers.find((l) => l.id === leverancierId);
        return leverancier ? leverancier.naam : "Onbekend";
    }

    async function handleSaveSoort(e: React.FormEvent) {
        e.preventDefault();
        if (!soortNaam.trim() || !leverancierId) {
            alert("Vul een soortnaam en leverancier in.");
            return;
        }

        try {
            if (editMode && selectedSoort) {
                await updateSoort(selectedSoort.id, soortNaam, Number(leverancierId));
                alert("Soort bijgewerkt!");
            } else {
                await addSoort(soortNaam, Number(leverancierId));
                alert("Soort toegevoegd!");
            }

            setModalOpen(false);
            setSoorten(await getSoorten());
            setEditMode(false);
        } catch (error) {
            alert(error);
        }
    }

    function handleEditSoort(soort: Soort) {
        setSelectedSoort(soort);
        setSoortNaam(soort.naam);
        setLeverancierId(String(soort.leverancierId));
        setEditMode(true);
        setModalOpen(true);
    }

    async function handleDeleteSoort(id: number) {
        const confirmDelete = window.confirm("Weet je zeker dat je deze soort wilt verwijderen?");
        if (confirmDelete) {
            try {
                await deleteSoort(id);
                setSoorten(prev => prev.filter(s => s.id !== id));
                alert("Soort verwijderd!");
            } catch (error) {
                alert(error);
            }
        }
    }

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-black">
                <Header />
                <div className="container mx-auto px-6 py-10">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-6 text-center">Soorten</h1>

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Zoek op naam..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setModalOpen(true);
                                    setSelectedSoort(null);
                                    setSoortNaam("");
                                    setLeverancierId("");
                                }}
                                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                + Toevoegen
                            </button>
                        </div>

                        <ul className="mt-4">
                            {soorten
                                .filter((s) => s.naam.toLowerCase().includes(search.toLowerCase()))
                                .map((s) => (
                                    <li key={s.id}
                                        className="flex justify-between items-center border-b border-gray-300 p-3">
                                        <div>
                                            <span className="text-lg font-bold">{s.naam}</span>
                                            <p className="text-sm">Leverancier: {getLeverancierNaam(s.leverancierId)}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditSoort(s)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                            >
                                                Bewerken
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSoort(s.id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            >
                                                Verwijderen
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">{editMode ? "Soort bewerken" : "Soort toevoegen"}</h2>
                            <form onSubmit={handleSaveSoort}>
                                <input
                                    type="text"
                                    value={soortNaam}
                                    onChange={(e) => setSoortNaam(e.target.value)}
                                    placeholder="Naam soort"
                                    className="border p-2 rounded w-full text-black focus:ring-1 focus:ring-green-500"
                                />
                                <select
                                    value={leverancierId}
                                    onChange={(e) => setLeverancierId(e.target.value)}
                                    className="border p-2 rounded w-full mt-2 text-black focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="">Selecteer leverancier</option>
                                    {leveranciers.map((lev) => (
                                        <option key={lev.id} value={lev.id}>
                                            {lev.naam}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                    >
                                        Annuleren
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        {editMode ? "Bijwerken" : "Toevoegen"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}
