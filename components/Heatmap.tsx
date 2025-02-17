"use client";

import { useEffect, useState } from "react";
import { getHeatmapData } from "@/app/actions/actions"; // Pas dit pad aan indien nodig

export default function Heatmap() {
    const [heatmap, setHeatmap] = useState<number[][]>([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getHeatmapData();
            setHeatmap(data);
        }
        fetchData();
    }, []);

    // Functie om kleur te bepalen op basis van aantalPlanten
    const getColor = (value: number) => {
        if (value === 0) return "bg-gray-200"; // Geen planten = lichtgrijs
        if (value < 5) return "bg-green-200"; // Weinig planten
        if (value < 15) return "bg-green-400";
        if (value < 30) return "bg-orange-400";
        return "bg-red-600"; // Veel planten
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Heatmap van Planten (20x20 Grid)</h2>
            <div className="grid grid-cols-20 gap-[2px] w-fit border border-gray-400">
                {heatmap.flatMap((row, y) =>
                    row.map((value, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`w-6 h-6 ${getColor(value)}`}
                            title={`(${x + 1}, ${y + 1}): ${value} planten`}
                        ></div>
                    ))
                )}
            </div>
        </div>
    );
}
