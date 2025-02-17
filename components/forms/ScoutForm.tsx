"use client";

import React, { useState, FormEvent } from "react";
import RasSelect from "@/components/RasSelect";
import { addScouting, updateScouting } from "@/app/actions/actions";
import { useLanguage } from "@/context/LanguageContext";

export interface ScoutingFormData {
    id?: number;
    leverweek: number;
    ras: string;
    oppotweek: number;
    bio: number;
    oorwoorm: boolean;
}

interface ScoutingFormProps {
    initialData?: ScoutingFormData;
    onClose?: () => void;
}

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

const ScoutForm: React.FC<ScoutingFormProps> = ({
                                                    initialData,
                                                    onClose = () => {},
                                                }) => {
    const { language } = useLanguage();
    const t =
        translations[language as keyof typeof translations] || translations.nl;

    const [formData, setFormData] = useState<ScoutingFormData>(
        initialData || {
            leverweek: 0,
            ras: "",
            oppotweek: 0,
            bio: 0,
            oorwoorm: false,
        }
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => {
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
        if (formData.bio < 0 || formData.bio > 5)
            newErrors.bio = "Bio moet tussen 0 en 5 liggen";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            if (formData.id) {
                await updateScouting(
                    formData.id,
                    formData.ras,
                    formData.leverweek,
                    formData.oppotweek,
                    formData.bio,
                    formData.oorwoorm
                );
            } else {
                await addScouting(
                    formData.leverweek,
                    formData.ras,
                    formData.oppotweek,
                    formData.bio,
                    formData.oorwoorm
                );
            }
            onClose();
        } catch (error) {
            console.error("Fout bij opslaan van scoutinggegevens:", error);
        }
    };

    return (
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
                    {errors.leverweek && (
                        <p className="text-red-500 text-sm mt-1">{errors.leverweek}</p>
                    )}
                </div>
                <div className="form-group">
                    <label className="block">{t.rasLabel}</label>
                    <RasSelect value={formData.ras} onChangeAction={handleChange} />
                    {errors.ras && (
                        <p className="text-red-500 text-sm mt-1">{errors.ras}</p>
                    )}
                </div>
                <div className="form-group">
                    <label className="block">{t.oppotweekLabel}</label>
                    <input
                        type="number"
                        name="oppotweek"
                        value={formData.oppotweek}
                        onChange={(e) =>
                            handleChange("oppotweek", Number(e.target.value))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.oppotweek && (
                        <p className="text-red-500 text-sm mt-1">{errors.oppotweek}</p>
                    )}
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
                    {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
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
    );
};

export default ScoutForm;
