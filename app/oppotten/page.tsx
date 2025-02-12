"use client";

import React, { useState, FormEvent } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/context/LanguageContext";
import ProtectedLayout from "@/components/ProtectedLayout";
import RasSelect from "@/components/RasSelect";
import {addOppotten} from "@/app/actions/actions";

interface OppottenFormData {
    leverweek: number;
    ras: string;
    aantalOpgepot: number;
    aantalWeggooi: number;
    redenWeggooi: string;
    andereReden: string;
}

export default function OppottenPage() {
    const { language } = useLanguage();
    const translations = {
        nl: {
            title: "Oppotten",
            leverweekLabel: "Leverweek",
            rasLabel: "Ras",
            aantalOpgepotLabel: "Aantal Opgepot",
            aantalWeggooiLabel: "Aantal Weggooi",
            redenWeggooiLabel: "Reden Weggooi",
            andereRedenLabel: "Andere reden",
            submitButton: "Verzenden",
            successMessage: "Formulier succesvol ingediend!",
            errorMessage: "Vul alle verplichte velden in.",
        },
    };


    const t = translations[language];

    const redenen = [
        { label: "Ziekte", value: "ziekte" },
        { label: "Schade", value: "schade" },
        { label: "Overproductie", value: "overproductie" },
        { label: "Anders", value: "anders" },
    ];

    const [formData, setFormData] = useState<OppottenFormData>({
        leverweek: 0,
        ras: '',
        aantalOpgepot: 0,
        aantalWeggooi: 0,
        redenWeggooi: '',
        andereReden: '',
    });

    const [showAndereReden, setShowAndereReden] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const handleChange = (name: string, value: string) => {
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


        const leverweek = Number(formData.leverweek);
        const aantalOpgepot = Number(formData.aantalOpgepot);
        const aantalWeggooi = Number(formData.aantalWeggooi);
        const ras = formData.ras.trim();
        const redenWeggooi = formData.redenWeggooi.trim();
        const andereReden = formData.andereReden.trim();

        if (!leverweek) newErrors.leverweek = "Leverweek is verplicht";
        if (!ras) newErrors.ras = "Selecteer een ras";
        if (!aantalOpgepot) newErrors.aantalOpgepot = "Aantal opgepot is verplicht";
        if (!aantalWeggooi) newErrors.aantalWeggooi = "Aantal weggegooid is verplicht";
        if (!redenWeggooi) newErrors.redenWeggooi = "Reden weggooien is verplicht";
        if (redenWeggooi === "anders" && !andereReden) newErrors.andereReden = "Voer een andere reden in";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            await addOppotten(leverweek, ras, aantalOpgepot, aantalWeggooi, redenWeggooi, andereReden);
            setShowModal(true);
            setFormData({
                leverweek: 0,
                ras: '',
                aantalOpgepot: 0,
                aantalWeggooi: 0,
                redenWeggooi: '',
                andereReden: '',
            });
            setShowAndereReden(false);
            setErrors({});
        } catch (error) {
            console.error("Fout bij opslaan van oppotgegevens:", error);
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
                                    onChange={(e) => handleChange("leverweek", e.target.value)}
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
                                <label className="block">{t.aantalOpgepotLabel}</label>
                                <input
                                    type="number"
                                    name="aantalOpgepot"
                                    value={formData.aantalOpgepot}
                                    onChange={(e) => handleChange("aantalOpgepot", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.aantalOpgepot && <p className="text-red-500 text-sm mt-1">{errors.aantalOpgepot}</p>}

                            </div>

                            <div className="form-group">
                                <label className="block">{t.aantalWeggooiLabel}</label>
                                <input
                                    type="number"
                                    name="aantalWeggooi"
                                    value={formData.aantalWeggooi}
                                    onChange={(e) => handleChange("aantalWeggooi", e.target.value)}
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
