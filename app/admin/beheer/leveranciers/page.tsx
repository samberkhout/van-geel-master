﻿"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import { deleteLeverancier, getLeveranciers, addLeverancier, updateLeverancier } from "@/app/actions/actions";

interface Leverancier {
    id: number;
    naam: string;
}

export default function LeveranciersPage() {
    const [leveranciers, setLeveranciers] = useState<Leverancier[]>([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedLeverancier, setSelectedLeverancier] = useState<Leverancier | null>(null);
    const [leverancierNaam, setLeverancierNaam] = useState("");

    useEffect(() => {
        async function fetchData() {
            const data = await getLeveranciers();
            setLeveranciers(data);
        }
        fetchData();
    }, []);

    async function handleSaveLeverancier(e: React.FormEvent) {
        e.preventDefault();
        if (!leverancierNaam.trim()) {
            alert("Vul een naam in.");
            return;
        }

        try {
            if (editMode && selectedLeverancier) {
                await updateLeverancier(selectedLeverancier.id, leverancierNaam);
                alert("Leverancier bijgewerkt!");
            } else {
                await addLeverancier(leverancierNaam);
                alert("Leverancier toegevoegd!");
            }

            setModalOpen(false);
            setLeveranciers(await getLeveranciers());
            setEditMode(false);
        } catch (error) {
            alert(error);
        }
    }

    function handleEditLeverancier(leverancier: Leverancier) {
        setSelectedLeverancier(leverancier);
        setLeverancierNaam(leverancier.naam);
        setEditMode(true);
        setModalOpen(true);
    }

    async function handleDelete(id: number) {
        const confirmDelete = window.confirm(
            "Weet je het zeker? Alle soorten van deze leverancier worden ook verwijderd."
        );

        if (confirmDelete) {
            try {
                await deleteLeverancier(id);
                setLeveranciers(prev => prev.filter(l => l.id !== id));
                alert("Leverancier verwijderd!");
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
                        <h1 className="text-3xl font-bold mb-6 text-center">Leveranciers</h1>

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
                                    setSelectedLeverancier(null);
                                    setLeverancierNaam("");
                                }}
                                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-36"
                            >
                                + Toevoegen
                            </button>
                        </div>

                        <ul className="mt-4">
                            {leveranciers.filter(l => l.naam.toLowerCase().includes(search.toLowerCase())).map(l => (
                                <li key={l.id} className="flex justify-between items-center border-b border-gray-300 p-3">
                                    <span className="text-lg">{l.naam}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditLeverancier(l)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                        >
                                            Bewerken
                                        </button>
                                        <button
                                            onClick={() => handleDelete(l.id)}
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
                            <h2 className="text-2xl font-bold mb-4">{editMode ? "Leverancier bewerken" : "Leverancier toevoegen"}</h2>
                            <form onSubmit={handleSaveLeverancier}>
                                <input
                                    type="text"
                                    value={leverancierNaam}
                                    onChange={(e) => setLeverancierNaam(e.target.value)}
                                    placeholder="Naam leverancier"
                                    className="border p-2 rounded w-full text-black focus:ring-1 focus:ring-green-500"
                                />
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
