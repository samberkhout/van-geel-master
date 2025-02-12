'use client';

import React, { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';
import ProtectedLayout from '@/components/ProtectedLayout';
import RasSelect from '@/components/RasSelect';
import { addScouting } from "@/app/actions/actions";

// TypeScript interface voor formulierdata
interface ScoutingFormData {
    leverweek: number;
    ras: string;
    oppotweek: number;
    bio: number;
    oorwoorm: boolean;
}

// Vertalingen
const translations = {
    nl: {
        title: "Scouting",
        leverweekLabel: "Leverweek",
        rasLabel: "Ras",
        oppotweekLabel: "Oppotweek",
        bioLabel: "Biologisch (0-5)",
        oorwoormLabel: "Oorworm Aanwezig?",
        submitButton: "Verzenden",
        successMessage: "Formulier succesvol ingediend!",
        errorMessage: "Vul alle velden correct in.",
    },
};

export default function ScoutingPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.nl;

    const [formData, setFormData] = useState<ScoutingFormData>({
        leverweek: 0,
        ras: '',
        oppotweek: 0,
        bio: 0,
        oorwoorm: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showModal, setShowModal] = useState(false);

    const handleChange = (name: string, value: string | number | boolean) => {
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

        if (!formData.leverweek) newErrors.leverweek = "Leverweek is verplicht";
        if (!formData.ras.trim()) newErrors.ras = "Selecteer een ras";
        if (!formData.oppotweek) newErrors.oppotweek = "Oppotweek is verplicht";
        if (formData.bio < 0 || formData.bio > 5) newErrors.bio = "Bio moet tussen 0 en 5 liggen";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addScouting(
                Number(formData.leverweek),
                formData.ras,
                Number(formData.oppotweek),
                Number(formData.bio),
                Boolean(formData.oorwoorm)
            );

            setShowModal(true);
            setFormData({
                leverweek: 0,
                ras: '',
                oppotweek: 0,
                bio: 0,
                oorwoorm: false,
            });
            setErrors({});
        } catch (error) {
            console.error("Fout bij opslaan van scoutinggegevens:", error);
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
                                <label className="block">{t.rasLabel}</label>
                                <RasSelect value={formData.ras} onChangeAction={handleChange} />
                                {errors.ras && <p className="text-red-500 text-sm mt-1">{errors.ras}</p>}
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
                                <label className="block">{t.bioLabel}</label>
                                <input
                                    type="number"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={(e) => handleChange("bio", Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                            </div>

                            <div className="form-group flex items-center">
                                <input
                                    type="checkbox"
                                    name="oorwoorm"
                                    checked={formData.oorwoorm}
                                    onChange={(e) => handleChange("oorwoorm", e.target.checked)}
                                    className="mr-2"
                                />
                                <label>{t.oorwoormLabel}</label>
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
