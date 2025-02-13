"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getSoorten, addSoort, deleteSoort, updateSoort } from "@/app/actions/actions";
import { getLeveranciers } from "@/app/actions/actions";
import SearchAndAddButton from "@/components/SearchAndAddButton";
import ItemList from "@/components/ItemList";

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
    function handleAddSoort(){
        setEditMode(false);
        setModalOpen(true);
        setSelectedSoort(null);
        setSoortNaam("");
        setLeverancierId("");

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

                        <SearchAndAddButton
                            search={search}
                            setSearch={setSearch}
                            onAdd={handleAddSoort}
                            placeholder="Zoek op naam..."
                        />

                        <ItemList
                            items={soorten.filter((s) =>
                                s.naam.toLowerCase().includes(search.toLowerCase())
                            )}
                            getTitle={(s) => s.naam}
                            getSubtitle={(s) => `Leverancier: ${getLeverancierNaam(s.leverancierId)}`}
                            onEdit={handleEditSoort}
                            onDelete={(id) => handleDeleteSoort(Number(id))}
                        />
                    </div>
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">{editMode ? "Soort bewerken" : "Soort toevoegen"}</h2>
                            <form onSubmit={handleSaveSoort}>
                                <input type="text" value={soortNaam} onChange={(e) => setSoortNaam(e.target.value)} placeholder="Naam soort" className="border p-2 rounded w-full text-black" />
                                <select value={leverancierId} onChange={(e) => setLeverancierId(e.target.value)} className="border p-2 rounded w-full mt-2 text-black">
                                    <option value="">Selecteer leverancier</option>
                                    {leveranciers.map((lev) => (
                                        <option key={lev.id} value={lev.id}>
                                            {lev.naam}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-4 flex justify-between">
                                    <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Annuleren</button>
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Opslaan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );

}
