'use client';

import React, { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';
import ProtectedLayout from '@/components/ProtectedLayout';
import RasSelect from '@/components/RasSelect';
import { addZiekZoeken } from "@/app/actions/actions";

interface ZiekZoekenFormData {
    leverweek: number;
    ras: string;
    aantalWeggooi: number;
    redenWeggooi: string;
    andereReden: string;
}

const translations = {
    nl: {
        title: "Ziek Zoeken",
        leverweekLabel: "Leverweek",
        rasLabel: "Ras",
        aantalWeggooiLabel: "Aantal Weggooi",
        redenWeggooiLabel: "Reden Weggooi",
        andereRedenLabel: "Andere reden",
        submitButton: "Verzenden",
        successMessage: "Formulier succesvol ingediend!",
        errorMessage: "Vul alle velden in.",
    },
};

export default function ZiekZoekenPage() {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.nl;

    const [formData, setFormData] = useState<ZiekZoekenFormData>({
        leverweek: 0,
        ras: '',
        aantalWeggooi: 0,
        redenWeggooi: '',
        andereReden: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showAndereReden, setShowAndereReden] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const redenen = [
        { label: "Ziekte", value: "ziekte" },
        { label: "Schade", value: "schade" },
        { label: "Overproductie", value: "overproductie" },
        { label: "Anders", value: "anders" },
    ];

    const handleChange = (name: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });

        if (name === "redenWeggooi") {
            setShowAndereReden(value === "anders");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!formData.leverweek) newErrors.leverweek = "Leverweek is verplicht";
        if (!formData.ras.trim()) newErrors.ras = "Selecteer een ras";
        if (!formData.aantalWeggooi) newErrors.aantalWeggooi = "Aantal weggooien is verplicht";
        if (!formData.redenWeggooi.trim()) newErrors.redenWeggooi = "Reden weggooien is verplicht";
        if (formData.redenWeggooi === "anders" && !formData.andereReden.trim()) {
            newErrors.andereReden = "Voer een andere reden in";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addZiekZoeken(
                Number(formData.leverweek),
                formData.ras,
                Number(formData.aantalWeggooi),
                formData.redenWeggooi,
                formData.andereReden
            );

            setShowModal(true);
            setFormData({
                leverweek: 0,
                ras: '',
                aantalWeggooi: 0,
                redenWeggooi: '',
                andereReden: '',
            });
            setShowAndereReden(false);
            setErrors({});
        } catch (error) {
            console.error("Fout bij opslaan van ziek zoek gegevens:", error);
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
                                <label className="block">{t.aantalWeggooiLabel}</label>
                                <input
                                    type="number"
                                    name="aantalWeggooi"
                                    value={formData.aantalWeggooi}
                                    onChange={(e) => handleChange("aantalWeggooi", Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.aantalWeggooi && <p className="text-red-500 text-sm mt-1">{errors.aantalWeggooi}</p>}
                            </div>

                            <div className="form-group">
                                <label className="block">{t.redenWeggooiLabel}</label>
                                <select
                                    name="redenWeggooi"
                                    value={formData.redenWeggooi}
                                    onChange={(e) => handleChange("redenWeggooi", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Selecteer een reden</option>
                                    {redenen.map((reden) => (
                                        <option key={reden.value} value={reden.value}>
                                            {reden.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.redenWeggooi && <p className="text-red-500 text-sm mt-1">{errors.redenWeggooi}</p>}
                            </div>

                            {showAndereReden && (
                                <div className="form-group">
                                    <label className="block">{t.andereRedenLabel}</label>
                                    <input
                                        type="text"
                                        name="andereReden"
                                        value={formData.andereReden}
                                        onChange={(e) => handleChange("andereReden", e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                    {errors.andereReden && <p className="text-red-500 text-sm mt-1">{errors.andereReden}</p>}
                                </div>
                            )}

                            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
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
