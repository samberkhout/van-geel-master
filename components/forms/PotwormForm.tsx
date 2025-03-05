"use client";

import React from "react";

interface PotwormInvoerProps {
    jaar: number;
    week: number;
    data: {
        afd1: number | null;
        afd16: number | null;
    };
    setData: (data: { afd1: number | null; afd16: number | null }) => void;
}

const PotwormInvoer: React.FC<PotwormInvoerProps> = ({ data, setData }) => {
    return (
        <div className="border p-4 rounded-md bg-gray-50">
            <h2 className="font-bold mb-2">Potworm Invoer</h2>
            <div className="mb-2">
                <label className="block">Afd 1:</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.afd1 ?? ""}
                    onChange={(e) => setData({...data, afd1: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mb-2">
                <label className="block">Afd 16:</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.afd16 ?? ""}
                    onChange={(e) => setData({...data, afd16: e.target.value ? Number(e.target.value) : null})}
                    className="border p-2 rounded w-full"
                />
            </div>
        </div>
    );
};

export default PotwormInvoer;
