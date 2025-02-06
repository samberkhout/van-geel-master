'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

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
        infoSoort: "Vul hier het ras in.",
        infoLeverweek: "Geef de week van levering aan.",
        infoOppotweek: "Geef de week van oppotten aan.",
        infoAantalPlanten: "Aantal planten met schade.",
        infoLocatie: "Geef de kap/rij en vak/trali nummer.",
    },
    en: {
        title: "Trips",
        soortLabel: "Variety",
        leverweekLabel: "Delivery Week",
        oppotweekLabel: "Repotting Week",
        aantalPlantenLabel: "Number of Plants",
        locatieLabel: "Location",
        submitButton: "Submit",
        successMessage: "Form successfully submitted!",
        errorMessage: "Please fill in all required fields.",
        infoSoort: "Enter the variety of the plants.",
        infoLeverweek: "Enter the delivery week.",
        infoOppotweek: "Enter the repotting week.",
        infoAantalPlanten: "Number of plants with damage.",
        infoLocatie: "Enter the section/row and slot number.",
    },
    pl: {
        title: "Transport",
        soortLabel: "Odmiana",
        leverweekLabel: "Tydzień dostawy",
        oppotweekLabel: "Tydzień przesadzania",
        aantalPlantenLabel: "Liczba roślin",
        locatieLabel: "Lokalizacja",
        submitButton: "Wyślij",
        successMessage: "Formularz został pomyślnie wysłany!",
        errorMessage: "Wypełnij wszystkie pola.",
        infoSoort: "Wprowadź odmianę roślin.",
        infoLeverweek: "Podaj tydzień dostawy.",
        infoOppotweek: "Podaj tydzień przesadzania.",
        infoAantalPlanten: "Liczba roślin z uszkodzeniami.",
        infoLocatie: "Podaj sekcję/rząd oraz numer miejsca.",
    },
};

type InfoIconProps = {
    text: string;
};

const InfoIcon: React.FC<InfoIconProps> = ({ text }) => {
    const [show, setShow] = useState(false);
    return (
        <span className="relative inline-block ml-1">
      <span className="cursor-pointer text-blue-500" onClick={() => setShow(!show)}>
        ℹ️
      </span>
            {show && (
                <div
                    className="absolute left-0 z-10 mt-2 w-64 p-2 bg-gray-200 text-gray-800 text-sm rounded shadow-lg"
                    onClick={() => setShow(false)}
                >
                    {text}
                </div>
            )}
    </span>
    );
};

export default function TripsPage() {
    const { language } = useLanguage();
    const t = translations[language];

    // Nu definiëren we de numerieke velden als ints in de state
    const [formData, setFormData] = useState<TripsFormData>({
        soort: '',
        leverweek: 0,
        oppotweek: 0,
        aantalPlanten: 0,
        locatie: '',
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Omdat de inputwaarde altijd een string is, converteren we naar int met Number(value)
        if (name === 'leverweek' || name === 'oppotweek' || name === 'aantalPlanten') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (
            !formData.soort.trim() ||
            formData.leverweek === 0 ||
            formData.oppotweek === 0 ||
            formData.aantalPlanten === 0 ||
            !formData.locatie.trim()
        ) {
            setShowErrorModal(true);
            return;
        }

        try {
            const payload = {
                soort: formData.soort,
                leverweek: formData.leverweek,
                oppotweek: formData.oppotweek,
                aantalPlanten: formData.aantalPlanten,
                locatie: formData.locatie,
            };
            const response = await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
            console.log('Data inserted successfully');
            setSuccessMessage(t.successMessage);
            setFormData({
                soort: '',
                leverweek: 0,
                oppotweek: 0,
                aantalPlanten: 0,
                locatie: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const closeModal = () => setSuccessMessage(null);
    const closeErrorModal = () => setShowErrorModal(false);

    return (
        <div className="min-h-screen bg-green-100 text-gray-900 relative">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-group">
                            <label className="block">
                                {t.soortLabel} <InfoIcon text={t.infoSoort} />
                                <input
                                    type="text"
                                    name="soort"
                                    value={formData.soort}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.leverweekLabel} <InfoIcon text={t.infoLeverweek} />
                                <input
                                    type="number"
                                    name="leverweek"
                                    value={formData.leverweek === 0 ? '' : formData.leverweek.toString()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.oppotweekLabel} <InfoIcon text={t.infoOppotweek} />
                                <input
                                    type="number"
                                    name="oppotweek"
                                    value={formData.oppotweek === 0 ? '' : formData.oppotweek.toString()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.aantalPlantenLabel} <InfoIcon text={t.infoAantalPlanten} />
                                <input
                                    type="number"
                                    name="aantalPlanten"
                                    value={formData.aantalPlanten === 0 ? '' : formData.aantalPlanten.toString()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.locatieLabel} <InfoIcon text={t.infoLocatie} />
                                <input
                                    type="text"
                                    name="locatie"
                                    value={formData.locatie}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                            {t.submitButton}
                        </button>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {successMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <p className="text-gray-800">{t.successMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <p className="text-red-800">{t.errorMessage}</p>
                        <button
                            onClick={closeErrorModal}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
