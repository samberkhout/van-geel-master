"use client";

import React from "react";

interface GemTakInvoerProps {
    jaar: number;
    week: number;
    data: {
        tak1: number | null;
        tak2: number | null;
        tak3: number | null;
        gemTakPerPlant: number | null;
    };
    setData: (data: {
        tak1: number | null;
        tak2: number | null;
        tak3: number | null;
        gemTakPerPlant: number | null;
    }) => void;
}

const GemTakInvoer: React.FC<GemTakInvoerProps> = ({ data, setData }) => {
    return (
        <div className="border p-4 rounded-md bg-gray-50">
            <h2 className="font-bold mb-4">Gemiddelde Takken Invoer</h2>

            <div className="mb-2">
                <label className="block">Tak 1:</label>
                <input
                    type="number"
                    value={data.tak1 ?? ""}
                    onChange={(e) => setData({...data, tak1: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="mb-2">
                <label className="block">Tak 2:</label>
                <input
                    type="number"
                    value={data.tak2 ?? ""}
                    onChange={(e) => setData({...data, tak2: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="mb-2">
                <label className="block">Tak 3:</label>
                <input
                    type="number"
                    value={data.tak3 ?? ""}
                    onChange={(e) => setData({...data, tak3: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="mb-2">
                <label className="block">Gem. Tak Per Plant:</label>
                <input
                    type="number"
                    value={data.gemTakPerPlant ?? ""}
                    onChange={(e) => setData({...data, gemTakPerPlant: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>
        </div>
    );
};

export default GemTakInvoer;
