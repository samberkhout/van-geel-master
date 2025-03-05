"use client";

import React, { useState, FormEvent } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";

// Importeren van de invoercomponenten
import PotwormInvoer from "@/components/forms/PotwormForm";
import QSMGroeiInvoer from "@/components/forms/QSMGroeiForm";
import GemTakInvoer from "@/components/forms/GenTakInvoer";

// Actions importeren
import { addPotwormData, addQSMgroeiData, addGemTakData } from "@/app/actions/actions";

export default function GrafiekenInvoerPage() {
   const [jaar, setJaar] = useState<number>(new Date().getFullYear());
    const [week, setWeek] = useState<number>(1);

    // State voor geselecteerde grafieken
    const [showPotworm, setShowPotworm] = useState<boolean>(false);
    const [showQSMGroei, setShowQSMGroei] = useState<boolean>(false);
    const [showGemTak, setShowGemTak] = useState<boolean>(false);

    // State voor specifieke data per grafiek
    const [potwormData, setPotwormData] = useState<{ afd1: number | null; afd16: number | null }>({
        afd1: null,
        afd16: null,
    });
    const [qsmGroeiData, setQSMGroeiData] = useState<{ soort: string; groei: number | null }>({
        soort: "",
        groei: null,
    });

    const [gemTakData, setGemTakData] = useState<{
        tak1: number | null;
        tak2: number | null;
        tak3: number | null;
        gemTakPerPlant: number | null
    }>({
        tak1: null,
        tak2: null,
        tak3: null,
        gemTakPerPlant: null,
    });
    // Formulier validatie en submit-logica
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (showPotworm && (potwormData.afd1 !== null || potwormData.afd16 !== null)) {
                await addPotwormData(jaar, week, potwormData.afd1 || 0, potwormData.afd16 || 0);
            }

            if (showQSMGroei && qsmGroeiData.soort && qsmGroeiData.groei !== null) {
                await addQSMgroeiData(jaar, week, qsmGroeiData.soort, qsmGroeiData.groei);
            }

            if (showGemTak && (
                gemTakData.tak1 !== null ||
                gemTakData.tak2 !== null ||
                gemTakData.tak3 !== null ||
                gemTakData.gemTakPerPlant !== null
            )) {
                await addGemTakData(
                    jaar,
                    week,
                    gemTakData.tak1 || 0,
                    gemTakData.tak2 || 0,
                    gemTakData.tak3 || 0,
                    gemTakData.gemTakPerPlant || 0
                );
            }

            alert("Data succesvol opgeslagen!");
        } catch (error) {
            console.error("Fout bij opslaan van gegevens:", error);
        }
    };

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-gray-900 relative">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">Invoer Grafieken</h1>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
                        {/* Tijdselectie */}
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold mb-1">Jaar:</label>
                                <input
                                    type="number"
                                    value={jaar}
                                    onChange={(e) => setJaar(Number(e.target.value))}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-1">Week:</label>
                                <input
                                    type="number"
                                    value={week}
                                    onChange={(e) => setWeek(Number(e.target.value))}
                                    className="border p-2 rounded w-full"
                                    min="1"
                                    max="52"
                                    required
                                />
                            </div>
                        </div>

                        {/* Selectie Grafieken */}
                        <div className="space-y-4">
                            <label className="block font-bold mb-1">Kies de grafieken waarvoor je data wilt invoeren:</label>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={showPotworm}
                                    onChange={() => setShowPotworm(!showPotworm)}
                                />{" "}
                                Potworm
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={showQSMGroei}
                                    onChange={() => setShowQSMGroei(!showQSMGroei)}
                                />{" "}
                                QSM Groei
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={showGemTak}
                                    onChange={() => setShowGemTak(!showGemTak)}
                                />{" "}
                                Gemiddelde Takken
                            </div>
                        </div>

                        {/* Invoervelden per grafiek */}
                        {showPotworm && (
                            <PotwormInvoer
                                jaar={jaar}
                                week={week}
                                data={potwormData}
                                setData={setPotwormData}
                            />
                        )}

                        {showQSMGroei && (
                            <QSMGroeiInvoer
                                jaar={jaar}
                                week={week}
                                data={qsmGroeiData}
                                setData={setQSMGroeiData}
                            />
                        )}

                        {showGemTak && (
                            <GemTakInvoer
                                jaar={jaar}
                                week={week}
                                data={gemTakData}
                                setData={setGemTakData}
                            />
                        )}

                        {/* Centrale submit knop */}
                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Alles Opslaan
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedLayout>
    );
}
