// /app/page.tsx
'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';
import ProtectedLayout from "@/components/ProtectedLayout";

const translations = {
    nl: {
        welcome: "Welkom op onze site!",
        description:
            "Kies een pagina om meer te ontdekken over onze plantverwerking en -registratie.",
        oppottenTitle: "Oppotten",
        oppottenDescription:
            "Registreer en beheer het oppotten van planten. Hier kun je details invoeren zoals leverweek, ras, aantal opgepotte planten en de reden voor eventueel weggooien.",
        oppottenLink: "Ga naar Oppotten",
        tripsTitle: "Trips",
        tripsDescription:
            "Bekijk en beheer de trips. Deze pagina bevat informatie over transport, leverweek, oppotweek en het aantal planten.",
        tripsLink: "Ga naar Trips",
        ziekZoekenTitle: "Ziek Zoeken",
        ziekZoekenDescription:
            "Zoek en registreer gegevens over planten met schade of ziekte. Vul hier onder andere de leverweek, het ras, het aantal weggooi en de reden daarvoor in.",
        ziekZoekenLink: "Ga naar Ziek Zoeken",
    },
    en: {
        welcome: "Welcome to our site!",
        description:
            "Choose a page to learn more about our plant processing and registration.",
        oppottenTitle: "Repotting",
        oppottenDescription:
            "Register and manage the repotting of plants. Enter details such as delivery week, variety, number repotted and the reason for discarding.",
        oppottenLink: "Go to Repotting",
        tripsTitle: "Trips",
        tripsDescription:
            "View and manage the trips. This page contains information about transport, delivery week, repotting week and the number of plants.",
        tripsLink: "Go to Trips",
        ziekZoekenTitle: "Disease Search",
        ziekZoekenDescription:
            "Search and register data about plants with damage or disease. Enter details such as delivery week, variety, number discarded and the reason for discarding.",
        ziekZoekenLink: "Go to Disease Search",
    },
    pl: {
        welcome: "Witamy na naszej stronie!",
        description:
            "Wybierz stronę, aby dowiedzieć się więcej o przetwarzaniu i rejestracji naszych roślin.",
        oppottenTitle: "Przesadzanie",
        oppottenDescription:
            "Zarejestruj i zarządzaj przesadzaniem roślin. Wprowadź szczegóły, takie jak tydzień dostawy, odmiana, liczba przesadzonych roślin oraz powód wyrzucenia.",
        oppottenLink: "Przejdź do przesadzania",
        tripsTitle: "Transport",
        tripsDescription:
            "Przeglądaj i zarządzaj transportem. Ta strona zawiera informacje o transporcie, tygodniu dostawy, tygodniu przesadzania i liczbie roślin.",
        tripsLink: "Przejdź do transportu",
        ziekZoekenTitle: "Wyszukiwanie chorób",
        ziekZoekenDescription:
            "Wyszukaj i zarejestruj dane dotyczące roślin z uszkodzeniami lub chorobami. Wprowadź szczegóły, takie jak tydzień dostawy, odmiana, liczba wyrzuconych roślin i powód wyrzucenia.",
        ziekZoekenLink: "Przejdź do wyszukiwania chorób",
    },
};

export default function HomePage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <ProtectedLayout>
        <div className="min-h-screen bg-green-100 text-gray-900">
            {/* Header met taalkeuzeknoppen */}
            <Header />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">{t.welcome}</h1>
                <p className="mb-8">{t.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
                    {/* Oppotten */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">{t.oppottenTitle}</h2>
                        <p className="mb-4">{t.oppottenDescription}</p>
                        <Link href="/oppotten" className="text-green-600 hover:underline font-bold">
                            {t.oppottenLink}
                        </Link>
                    </div>

                    {/* Trips */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">{t.tripsTitle}</h2>
                        <p className="mb-4">{t.tripsDescription}</p>
                        <Link href="/trips" className="text-green-600 hover:underline font-bold">
                            {t.tripsLink}
                        </Link>
                    </div>

                    {/* Ziek Zoeken */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">{t.ziekZoekenTitle}</h2>
                        <p className="mb-4">{t.ziekZoekenDescription}</p>
                        <Link href="/ziek-zoeken" className="text-green-600 hover:underline font-bold">
                            {t.ziekZoekenLink}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    </ProtectedLayout>
    );
}
