"use client";

import React, { useState, FormEvent } from "react";
import RasSelect from "@/components/RasSelect";
import { addLevering } from "@/app/actions/actions";
import { useLanguage } from "@/context/LanguageContext";

export interface GasFormData {
    id?: number;
    ras: string;
    leverweek: number;
    gasweek: number;
    aantal: number;
}

interface GasFormProps {
    initialData?: GasFormData;
    onClose?: () => void;
}

const translations = {
    nl: {
        title: "Gas invoer",
        leverweekLabel: "Leverweek",
        gasweekLabel: "Gasweek",
        rasLabel: "Ras",
        aantalLabel: "Aantal",
        submitButton: "Verzenden",
        successMessage: "Formulier succesvol ingediend!",
        errorMessage: "Vul alle verplichte velden in.",
    },
};

const LeveringForm: React.FC<GasFormProps> = ({ initialData, onClose = () => {} }) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.nl;

    const [formData, setFormData] = useState<GasFormData>(
        initialData || {
            ras: "",
            leverweek: 0,
            gasweek: 0,
            aantal: 0,
        }
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (name: string, value: string | number) => {
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

        if (!formData.ras) newErrors.ras = "Ras is verplicht";
        if (!formData.leverweek) newErrors.leverweek = "Leverweek is verplicht";
        if (!formData.gasweek) newErrors.gasweek = "Gasweek is verplicht";
        if (!formData.aantal) newErrors.aantal = "Aantal is verplicht";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addLevering(formData.ras, formData.leverweek, formData.gasweek, formData.aantal);
            onClose();
        } catch (error) {
            console.error("Fout bij opslaan van gasInvoer invoer:", error);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Soort/Ras */}
                <div className="form-group">
                    <label className="block">{t.rasLabel}</label>
                    <RasSelect value={formData.ras} onChangeAction={handleChange} />
                    {errors.ras && <p className="text-red-500 text-sm mt-1">{errors.ras}</p>}
                </div>

                {/* Leverweek */}
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

                {/* Gasweek */}
                <div className="form-group">
                    <label className="block">{t.gasweekLabel}</label>
                    <input
                        type="number"
                        name="gasweek"
                        value={formData.gasweek}
                        onChange={(e) => handleChange("gasweek", Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.gasweek && <p className="text-red-500 text-sm mt-1">{errors.gasweek}</p>}
                </div>

                {/* Aantal */}
                <div className="form-group">
                    <label className="block">{t.aantalLabel}</label>
                    <input
                        type="number"
                        name="aantal"
                        value={formData.aantal}
                        onChange={(e) => handleChange("aantal", Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.aantal && <p className="text-red-500 text-sm mt-1">{errors.aantal}</p>}
                </div>

                {/* Verzenden knop */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {t.submitButton}
                </button>
            </form>
        </div>
    );
};

export default LeveringForm;
