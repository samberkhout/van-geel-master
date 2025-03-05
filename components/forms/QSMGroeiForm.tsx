"use client";

import React from "react";

interface QSMGroeiInvoerProps {
    jaar: number;
    week: number;
    data: {
        soort: string;
        groei: number | null;
    };
    setData: (data: { soort: string; groei: number | null }) => void;
}

const QSMGroeiInvoer: React.FC<QSMGroeiInvoerProps> = ({ data, setData }) => {
    return (
        <div className="border p-4 rounded-md bg-gray-50">
            <h2 className="font-bold mb-2">QSM Groei Invoer</h2>
            <div className="mb-2">
                <label className="block">Soort:</label>
                <input
                    type="text"
                    value={data.soort}
                    onChange={(e) => setData({...data, soort: e.target.value})}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-2">
                <label className="block">Groei:</label>
                <input
                    type="number"
                    value={data.groei ?? ""}
                    onChange={(e) => setData({...data, groei: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>
        </div>
    );
};

export default QSMGroeiInvoer;
