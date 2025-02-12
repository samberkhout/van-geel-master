﻿'use client';

import React, { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';
import ProtectedLayout from '@/components/ProtectedLayout';
import RasSelect from '@/components/RasSelect';
import { addTrips } from "@/app/actions/actions";

interface TripsFormData {
    soort: string;
    leverweek: number;
    oppotweek: number;
    aantalPlanten: number;
    locatie: string;
}

const translations = {
    nl: {
        title: "Trips",
        soortLabel: "Ras",
        leverweekLabel: "Leverweek",
        oppotweekLabel: "Oppotweek",
        aantalPlantenLabel: "Aantal Planten",
        locatieLabel: "Locatie",
        submitButton: "Verzenden",
        successMessage: "Formulier succesvol ingediend!",
        errorMessage: "Vul alle velden in.",
    },
};

export default function TripsPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.nl;

    const [formData, setFormData] = useState<TripsFormData>({
        soort: '',
        leverweek: 0,
        oppotweek: 0,
        aantalPlanten: 0,
        locatie: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showModal, setShowModal] = useState(false);

    const handleChange = (name: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!formData.soort.trim()) newErrors.soort = "Selecteer een ras";
        if (!formData.leverweek) newErrors.leverweek = "Leverweek is verplicht";
        if (!formData.oppotweek) newErrors.oppotweek = "Oppotweek is verplicht";
        if (!formData.aantalPlanten) newErrors.aantalPlanten = "Aantal planten is verplicht";
        if (!formData.locatie.trim()) newErrors.locatie = "Locatie is verplicht";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addTrips(
                formData.soort,
                Number(formData.leverweek),
                Number(formData.oppotweek),
                Number(formData.aantalPlanten),
                formData.locatie
            );

            setShowModal(true);
            setFormData({
                soort: '',
                leverweek: 0,
                oppotweek: 0,
                aantalPlanten: 0,
                locatie: '',
            });
            setErrors({});
        } catch (error) {
            console.error("Fout bij opslaan van tripsgegevens:", error);
        }
    };

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-gray-900 relative">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="form-group">
                                <label className="block">{t.soortLabel}</label>
                                <RasSelect value={formData.soort} onChangeAction={handleChange} />
                                {errors.soort && <p className="text-red-500 text-sm mt-1">{errors.soort}</p>}
                            </div>

                            <div className="form-group">
                                <label className="block">{t.leverweekLabel}</label>
                                <input
                                    type="number"
                                    name="leverweek"
                                    value={formData.leverweek}
                                    onChange={(e) => handleChange("leverweek", Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.leverweek && <p className="text-red-500 text-sm mt-1">{errors.leverweek}</p>}
                            </div>

                            <div className="form-group">
                                <label className="block">{t.oppotweekLabel}</label>
                                <input
                                    type="number"
                                    name="oppotweek"
                                    value={formData.oppotweek}
                                    onChange={(e) => handleChange("oppotweek", Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.oppotweek && <p className="text-red-500 text-sm mt-1">{errors.oppotweek}</p>}
                            </div>

                            <div className="form-group">
                                <label className="block">{t.aantalPlantenLabel}</label>
                                <input
                                    type="number"
                                    name="aantalPlanten"
                                    value={formData.aantalPlanten}
                                    onChange={(e) => handleChange("aantalPlanten", Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.aantalPlanten && <p className="text-red-500 text-sm mt-1">{errors.aantalPlanten}</p>}
                            </div>

                            <div className="form-group">
                                <label className="block">{t.locatieLabel}</label>
                                <input
                                    type="text"
                                    name="locatie"
                                    value={formData.locatie}
                                    onChange={(e) => handleChange("locatie", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.locatie && <p className="text-red-500 text-sm mt-1">{errors.locatie}</p>}
                            </div>

                            <button
                                type="submit"
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            >
                                {t.submitButton}
                            </button>
                        </form>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded p-6 max-w-sm w-full">
                            <p className="text-gray-800">{t.successMessage}</p>
                            <button onClick={() => setShowModal(false)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}
