'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '@/components/Header';
import {useLanguage} from "@/context/LanguageContext";

interface OppottenFormData {
    leverweek: number;
    ras: string;
    aantalOpgepot: number;
    aantalWeggooi: number;
    redenWeggooi: string;
    andereReden: string;
}

interface Reden {
    label: string;
    value: string;
}

const redenen: Reden[] = [
    { label: 'Ziekte', value: 'ziekte' },
    { label: 'Schade', value: 'schade' },
    { label: 'Overproductie', value: 'overproductie' },
    { label: 'Anders', value: 'anders' },
];
export type Language = 'nl' | 'en' | 'pl';

// Definieer een type voor de vertalingen
type Translation = {
    title: string;
    leverweekLabel: string;
    rasLabel: string;
    aantalOpgepotLabel: string;
    aantalWeggooiLabel: string;
    redenWeggooiLabel: string;
    andereRedenLabel: string;
    submitButton: string;
    successMessage: string;
    errorMessage: string;
    infoLeverweek: string;
    infoRas: string;
    infoAantalOpgepot: string;
    infoAantalWeggooi: string;
    infoRedenWeggooi: string;
    infoAndereReden: string;
};

const translations: Record<Language, Translation> = {
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
        infoLeverweek: "Geef de week van levering aan.",
        infoRas: "Geef het ras van de planten aan.",
        infoAantalOpgepot: "Aantal planten die opgepot zijn.",
        infoAantalWeggooi: "Aantal planten die weggegooid worden.",
        infoRedenWeggooi: "Reden waarom de planten weggegooid worden.",
        infoAndereReden: "Specificeer een andere reden.",
    },
    en: {
        title: "Repotting",
        leverweekLabel: "Delivery Week",
        rasLabel: "Variety",
        aantalOpgepotLabel: "Number Repotted",
        aantalWeggooiLabel: "Number Discarded",
        redenWeggooiLabel: "Reason for Discarding",
        andereRedenLabel: "Other Reason",
        submitButton: "Submit",
        successMessage: "Form successfully submitted!",
        errorMessage: "Please fill in all required fields.",
        infoLeverweek: "Enter the delivery week.",
        infoRas: "Enter the variety of the plants.",
        infoAantalOpgepot: "Number of plants repotted.",
        infoAantalWeggooi: "Number of plants discarded.",
        infoRedenWeggooi: "Reason for discarding the plants.",
        infoAndereReden: "Specify another reason.",
    },
    pl: {
        title: "Przesadzanie",
        leverweekLabel: "Tydzień dostawy",
        rasLabel: "Odmiana",
        aantalOpgepotLabel: "Liczba przesadzonych",
        aantalWeggooiLabel: "Liczba wyrzuconych",
        redenWeggooiLabel: "Powód wyrzucenia",
        andereRedenLabel: "Inny powód",
        submitButton: "Wyślij",
        successMessage: "Formularz został pomyślnie wysłany!",
        errorMessage: "Wypełnij wszystkie pola.",
        infoLeverweek: "Podaj tydzień dostawy.",
        infoRas: "Podaj odmianę roślin.",
        infoAantalOpgepot: "Liczba przesadzonych roślin.",
        infoAantalWeggooi: "Liczba wyrzuconych roślin.",
        infoRedenWeggooi: "Powód wyrzucenia roślin.",
        infoAndereReden: "Określ inny powód.",
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

export default function OppottenPage() {
    const { language } = useLanguage();
    const t = translations[language];

    // Nu gebruiken we getallen voor de numerieke velden
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
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Omdat de input altijd een string geeft, converteren we via Number() als het numeriek moet zijn
        if (name === 'leverweek' || name === 'aantalOpgepot' || name === 'aantalWeggooi') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (name === 'redenWeggooi') {
            setShowAndereReden(value === 'anders');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validatie: controleer of alle verplichte velden ingevuld zijn
        if (
            !formData.leverweek ||
            !formData.ras.trim() ||
            !formData.aantalOpgepot ||
            !formData.aantalWeggooi ||
            !formData.redenWeggooi.trim() ||
            (formData.redenWeggooi === 'anders' && !formData.andereReden.trim())
        ) {
            setShowErrorModal(true);
            return;
        }

        try {
            const response = await fetch('/api/oppotten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
            console.log('Data inserted successfully');

            setShowModal(true);
            // Reset formulier
            setFormData({
                leverweek: 0,
                ras: '',
                aantalOpgepot: 0,
                aantalWeggooi: 0,
                redenWeggooi: '',
                andereReden: '',
            });
            setShowAndereReden(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const closeModal = () => setShowModal(false);
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
                                {t.leverweekLabel} <InfoIcon text={t.infoLeverweek} />
                                <input
                                    type="number"
                                    name="leverweek"
                                    value={formData.leverweek === 0 ? '' : formData.leverweek.toString()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    placeholder=""/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.rasLabel} <InfoIcon text={t.infoRas} />
                                <input
                                    type="text"
                                    name="ras"
                                    value={formData.ras}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.aantalOpgepotLabel} <InfoIcon text={t.infoAantalOpgepot} />
                                <input
                                    type="number"
                                    name="aantalOpgepot"
                                    value={formData.aantalOpgepot === 0 ? '' : formData.aantalOpgepot.toString()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.aantalWeggooiLabel} <InfoIcon text={t.infoAantalWeggooi} />
                                <input
                                    type="number"
                                    name="aantalWeggooi"
                                    value={formData.aantalWeggooi === 0 ? '' : formData.aantalWeggooi.toString()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="block">
                                {t.redenWeggooiLabel} <InfoIcon text={t.infoRedenWeggooi} />
                                <select
                                    name="redenWeggooi"
                                    value={formData.redenWeggooi}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option value="">
                                        {language === 'nl'
                                            ? "Selecteer reden"
                                            : language === 'en'
                                                ? "Select reason"
                                                : "Wybierz powód"}
                                    </option>
                                    {redenen.map((reden) => (
                                        <option key={reden.value} value={reden.value}>
                                            {reden.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        {showAndereReden && (
                            <div className="form-group">
                                <label className="block">
                                    {t.andereRedenLabel} <InfoIcon text={t.infoAndereReden} />
                                    <input
                                        type="text"
                                        name="andereReden"
                                        value={formData.andereReden}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                                </label>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                            {t.submitButton}
                        </button>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && (
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
