"use client";

import React, { useState, FormEvent } from "react";
import RasSelect from "@/components/RasSelect";
import { addTrips, updateTrips } from "@/app/actions/actions";
import { useLanguage } from "@/context/LanguageContext";

export interface TripsFormData {
    id?: number;
    ras: string;
    leverweek: number;
    oppotweek: number;
    aantalPlanten: number;
    locatie: { x: number; y: number };
}

interface TripsFormProps {
    initialData?: TripsFormData;
    onClose: () => void;
}

const translations = {
    nl: {
        title: "Trips",
        rasLabel: "Ras",
        leverweekLabel: "Leverweek",
        oppotweekLabel: "Oppotweek",
        aantalPlantenLabel: "Aantal Planten",
        locatieXLabel: "Locatie rij",
        locatieYLabel: "Locatie vak",
        submitButton: "Verzenden",
        successMessage: "Formulier succesvol ingediend!",
        errorMessage: "Vul alle velden in.",
    },
};

const TripsForm: React.FC<TripsFormProps> = ({ initialData, onClose }) => {
    const { language } = useLanguage();
    const t =
        translations[language as keyof typeof translations] || translations.nl;

    const [formData, setFormData] = useState<TripsFormData>(
        initialData || {
            ras: "",
            leverweek: 0,
            oppotweek: 0,
            aantalPlanten: 0,
            locatie: { x: 0, y: 0 },
        }
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (name: string, value: string | number) => {
        setFormData((prev) => {
            if (name === "locatieX" || name === "locatieY") {
                const newLocatie = {
                    ...prev.locatie,
                    [name === "locatieX" ? "x" : "y"]: Number(value),
                };
                return { ...prev, locatie: newLocatie };
            }
            return { ...prev, [name]: value };
        });

        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!formData.ras.trim()) newErrors.ras = "Selecteer een ras";
        if (!formData.leverweek) newErrors.leverweek = "Leverweek is verplicht";
        if (!formData.oppotweek) newErrors.oppotweek = "Oppotweek is verplicht";
        if (!formData.aantalPlanten)
            newErrors.aantalPlanten = "Aantal planten is verplicht";
        if (formData.locatie.x < 0 || formData.locatie.x > 20)
            newErrors.locatieX = "X moet tussen 0 en 20 liggen";
        if (formData.locatie.y < 0 || formData.locatie.y > 20)
            newErrors.locatieY = "Y moet tussen 0 en 20 liggen";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            if (formData.id) {
                await updateTrips(
                    formData.id,
                    formData.ras,
                    formData.leverweek,
                    formData.oppotweek,
                    formData.aantalPlanten,
                    formData.locatie
                );
            } else {
                await addTrips(
                    formData.ras,
                    formData.leverweek,
                    formData.oppotweek,
                    formData.aantalPlanten,
                    formData.locatie
                );
            }
            // Sluit de modal na een succesvolle update/toevoeging
            onClose();
        } catch (error) {
            console.error("Fout bij opslaan van tripsgegevens:", error);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Formuliervelden */}
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
                        onChange={(e) => handleChange("oppotweek", Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.oppotweek && (
                        <p className="text-red-500 text-sm mt-1">{errors.oppotweek}</p>
                    )}
                </div>
                <div className="form-group">
                    <label className="block">{t.aantalPlantenLabel}</label>
                    <input
                        type="number"
                        name="aantalPlanten"
                        value={formData.aantalPlanten}
                        onChange={(e) =>
                            handleChange("aantalPlanten", Number(e.target.value))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.aantalPlanten && (
                        <p className="text-red-500 text-sm mt-1">{errors.aantalPlanten}</p>
                    )}
                </div>
                <div className="form-group">
                    <label className="block">{t.locatieXLabel}</label>
                    <input
                        type="number"
                        name="locatieX"
                        value={formData.locatie.x}
                        min="0"
                        max="20"
                        onChange={(e) => handleChange("locatieX", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.locatieX && (
                        <p className="text-red-500 text-sm mt-1">{errors.locatieX}</p>
                    )}
                </div>
                <div className="form-group">
                    <label className="block">{t.locatieYLabel}</label>
                    <input
                        type="number"
                        name="locatieY"
                        value={formData.locatie.y}
                        min="0"
                        max="20"
                        onChange={(e) => handleChange("locatieY", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.locatieY && (
                        <p className="text-red-500 text-sm mt-1">{errors.locatieY}</p>
                    )}
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

export default TripsForm;
