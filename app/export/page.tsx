// export/page.tsx
"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import ExcelJS from "exceljs";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import {
    getTripsEntriesExport,
    getOppottenEntriesExport,
    getScoutingEntriesExport,
    getZiekZoekenEntriesExport,
    getLeveranciers,
} from "@/app/actions/actions";

interface Leverancier {
    id: number;
    naam: string;
}

// In deze interface is createdAt een Date en locatie is van het type { x: number; y: number } | undefined
interface ExportEntry {
    createdAt: Date;
    leverweek: number;
    oppotweek?: number;
    aantalPlanten?: number;
    locatie?: { x: number; y: number };
    soort?: {
        naam: string;
        leverancier?: {
            naam: string;
        };
    };
    aantalOpgepot?: number;
    aantalWeggooi?: number;
    redenWeggooi?: string;
    andereReden?: string | null;
    bio?: number;
    oorwoorm?: boolean;
}

// Helperfunctie om de ruwe locatie-waarde te normaliseren
const normalizeData = (data: unknown[]): ExportEntry[] => {
    return data.map((entry) => {
        const e = entry as ExportEntry;
        return {
            ...e,
            locatie:
                e.locatie &&
                typeof e.locatie === "object" &&
                "x" in e.locatie &&
                "y" in e.locatie &&
                e.locatie.x !== null &&
                e.locatie.y !== null
                    ? (e.locatie as { x: number; y: number })
                    : undefined,
        };
    });
};


const ExportPage: React.FC = () => {
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [selectedSupplier, setSelectedSupplier] = useState<string>("");
    const [suppliers, setSuppliers] = useState<Leverancier[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Checkboxes voor welke exports gewenst zijn
    const [exportTrips, setExportTrips] = useState<boolean>(true);
    const [exportOppotten, setExportOppotten] = useState<boolean>(true);
    const [exportScouting, setExportScouting] = useState<boolean>(true);
    const [exportZiekZoeken, setExportZiekZoeken] = useState<boolean>(true);

    const fromInputRef = useRef<HTMLInputElement | null>(null);
    const toInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getLeveranciers();
                setSuppliers(data);
            } catch (error) {
                console.error("Fout bij ophalen leveranciers:", error);
            }
        };
        fetchSuppliers();
    }, []);

    // Open de datumpicker (gebruik showPicker indien beschikbaar)
    const openDatePicker = (ref: RefObject<HTMLInputElement | null>) => {
        if (ref.current) {
            if ("showPicker" in ref.current && typeof ref.current.showPicker === "function") {
                ref.current.showPicker();
            } else {
                ref.current.focus();
            }
        }
    };

    // Filterfunctie: controleer datum en leverancier
    const filterData = (data: ExportEntry[]): ExportEntry[] => {
        return data.filter((entry) => {
            const entryDate = entry.createdAt;
            const from = fromDate ? new Date(fromDate) : new Date("1970-01-01");
            const to = toDate ? new Date(toDate) : new Date();
            const supplierMatch = selectedSupplier
                ? entry.soort?.leverancier?.naam.toLowerCase() === selectedSupplier.toLowerCase()
                : true;
            return entryDate >= from && entryDate <= to && supplierMatch;
        });
    };

    const exportToExcel = async () => {
        setLoading(true);
        try {
            const workbook = new ExcelJS.Workbook();

            // Haal de ruwe data op
            const tripsDataRaw = exportTrips ? await getTripsEntriesExport() : [];
            const oppottenDataRaw = exportOppotten ? await getOppottenEntriesExport() : [];
            const scoutingDataRaw = exportScouting ? await getScoutingEntriesExport() : [];
            const ziekZoekenDataRaw = exportZiekZoeken ? await getZiekZoekenEntriesExport() : [];

            // Normaliseer de data
            const normalizedTrips = normalizeData(tripsDataRaw);
            const normalizedOppotten = normalizeData(oppottenDataRaw);
            const normalizedScouting = normalizeData(scoutingDataRaw);
            const normalizedZiekZoeken = normalizeData(ziekZoekenDataRaw);

            // Filter de data op basis van datum en leverancier
            const tripsData = filterData(normalizedTrips);
            const oppottenData = filterData(normalizedOppotten);
            const scoutingData = filterData(normalizedScouting);
            const ziekZoekenData = filterData(normalizedZiekZoeken);

            // Voeg alleen de sheets toe die geselecteerd zijn
            if (exportTrips) {
                const tripsSheet = workbook.addWorksheet("Trips");
                tripsSheet.columns = [
                    { header: "Soort", key: "soort", width: 15 },
                    { header: "Leverweek", key: "leverweek", width: 15 },
                    { header: "Oppotweek", key: "oppotweek", width: 15 },
                    { header: "Aantal Planten", key: "aantalPlanten", width: 20 },
                    { header: "Locatie X", key: "locatieX", width: 10 },
                    { header: "Locatie Y", key: "locatieY", width: 10 },
                    { header: "Datum", key: "datum", width: 15 },
                    { header: "Leverancier", key: "leverancier", width: 20 },
                ];
                tripsData.forEach((entry) => {
                    tripsSheet.addRow({
                        soort: entry.soort?.naam || "",
                        leverweek: entry.leverweek,
                        oppotweek: entry.oppotweek,
                        aantalPlanten: entry.aantalPlanten,
                        locatieX: entry.locatie?.x,
                        locatieY: entry.locatie?.y,
                        datum: entry.createdAt.toLocaleDateString(),
                        leverancier: entry.soort?.leverancier?.naam || "",
                    });
                });
            }

            if (exportOppotten) {
                const oppottenSheet = workbook.addWorksheet("Oppotten");
                oppottenSheet.columns = [
                    { header: "Leverweek", key: "leverweek", width: 15 },
                    { header: "Soort", key: "soort", width: 15 },
                    { header: "Aantal Opgepot", key: "aantalOpgepot", width: 20 },
                    { header: "Aantal Weggooi", key: "aantalWeggooi", width: 20 },
                    { header: "Reden Weggooi", key: "redenWeggooi", width: 20 },
                    { header: "Andere Reden", key: "andereReden", width: 20 },
                    { header: "Datum", key: "datum", width: 15 },
                    { header: "Leverancier", key: "leverancier", width: 20 },
                ];
                oppottenData.forEach((entry) => {
                    oppottenSheet.addRow({
                        leverweek: entry.leverweek,
                        soort: entry.soort?.naam || "",
                        aantalOpgepot: entry.aantalOpgepot,
                        aantalWeggooi: entry.aantalWeggooi,
                        redenWeggooi: entry.redenWeggooi,
                        andereReden: entry.andereReden || "",
                        datum: entry.createdAt.toLocaleDateString(),
                        leverancier: entry.soort?.leverancier?.naam || "",
                    });
                });
            }

            if (exportScouting) {
                const scoutingSheet = workbook.addWorksheet("Scouting");
                scoutingSheet.columns = [
                    { header: "Leverweek", key: "leverweek", width: 15 },
                    { header: "Soort", key: "soort", width: 15 },
                    { header: "Oppotweek", key: "oppotweek", width: 15 },
                    { header: "Bio", key: "bio", width: 10 },
                    { header: "Oorwoorm", key: "oorwoorm", width: 10 },
                    { header: "Datum", key: "datum", width: 15 },
                    { header: "Leverancier", key: "leverancier", width: 20 },
                ];
                scoutingData.forEach((entry) => {
                    scoutingSheet.addRow({
                        leverweek: entry.leverweek,
                        soort: entry.soort?.naam || "",
                        oppotweek: entry.oppotweek,
                        bio: entry.bio,
                        oorwoorm: entry.oorwoorm ? "Ja" : "Nee",
                        datum: entry.createdAt.toLocaleDateString(),
                        leverancier: entry.soort?.leverancier?.naam || "",
                    });
                });
            }

            if (exportZiekZoeken) {
                const ziekZoekenSheet = workbook.addWorksheet("ZiekZoeken");
                ziekZoekenSheet.columns = [
                    { header: "Leverweek", key: "leverweek", width: 15 },
                    { header: "Soort", key: "soort", width: 15 },
                    { header: "Aantal Weggooi", key: "aantalWeggooi", width: 20 },
                    { header: "Reden Weggooi", key: "redenWeggooi", width: 20 },
                    { header: "Andere Reden", key: "andereReden", width: 20 },
                    { header: "Datum", key: "datum", width: 15 },
                    { header: "Leverancier", key: "leverancier", width: 20 },
                ];
                ziekZoekenData.forEach((entry) => {
                    ziekZoekenSheet.addRow({
                        leverweek: entry.leverweek,
                        soort: entry.soort?.naam || "",
                        aantalWeggooi: entry.aantalWeggooi,
                        redenWeggooi: entry.redenWeggooi,
                        andereReden: entry.andereReden || "",
                        datum: entry.createdAt.toLocaleDateString(),
                        leverancier: entry.soort?.leverancier?.naam || "",
                    });
                });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "export.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Fout bij exporteren:", error);
        }
        setLoading(false);
    };

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-black">
                <Header />
                <div className="container mx-auto px-6 py-10">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-6 text-center">Data Exporteren naar Excel</h1>
                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block mb-1">Vanaf datum:</label>
                                <div
                                    className="border p-2 rounded w-full cursor-pointer"
                                    onClick={() => openDatePicker(fromInputRef)}
                                >
                                    <input
                                        ref={fromInputRef}
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="w-full text-black bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Tot datum:</label>
                                <div
                                    className="border p-2 rounded w-full cursor-pointer"
                                    onClick={() => openDatePicker(toInputRef)}
                                >
                                    <input
                                        ref={toInputRef}
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="w-full text-black bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1">Leverancier:</label>
                                <select
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(e.target.value)}
                                    className="border p-2 rounded w-full"
                                >
                                    <option value="">Alle leveranciers</option>
                                    {suppliers.map((lev) => (
                                        <option key={lev.id} value={lev.naam}>
                                            {lev.naam}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={exportTrips}
                                        onChange={(e) => setExportTrips(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Export Trips
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={exportOppotten}
                                        onChange={(e) => setExportOppotten(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Export Oppotten
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={exportScouting}
                                        onChange={(e) => setExportScouting(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Export Scouting
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={exportZiekZoeken}
                                        onChange={(e) => setExportZiekZoeken(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Export ZiekZoeken
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={exportToExcel}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        >
                            {loading ? "Exporteren..." : "Exporteren naar Excel"}
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default ExportPage;
