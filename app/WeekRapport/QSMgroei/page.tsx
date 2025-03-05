"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getQSMgroei } from "@/app/actions/actions";
import { Line } from "react-chartjs-2";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Typedefinities
interface QSMGroei {
    id: number;
    weekNummer: number;
    jaar: number;
    soort: string;
    groei: number;
    jaarWeek?: string; // Optioneel omdat het later wordt berekend
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: (number | null)[];
        borderColor: string;
        borderWidth: number;
        pointRadius: number;
        fill: boolean;
    }[];
}

export default function QSMGroeiPage() {
    const [data, setData] = useState<QSMGroei[]>([]);
    const [selectedSoorten, setSelectedSoorten] = useState<string[]>([]);
    const [chartData, setChartData] = useState<ChartData | null>(null);

    const [weeks, setWeeks] = useState<number[]>([]);
    const [sliderRange, setSliderRange] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        async function fetchData() {
            const groeiData = await getQSMgroei();

            if (groeiData.length === 0) return;

            const transformedData = groeiData
                .filter(d => d.groei !== 0)
                .map(d => ({
                    ...d,
                    jaarWeek: `${d.jaar}-W${String(d.weekNummer).padStart(2, "0")}`
                }));

            transformedData.sort((a, b) => a.jaar - b.jaar || a.weekNummer - b.weekNummer);

            setData(transformedData);

            // Maak een lijst van alle unieke jaar-week combinaties
            const uniqueWeeks = transformedData.map(d => ({
                value: (d.jaar - transformedData[0].jaar) * 52 + d.weekNummer,
                label: `${d.jaar}-W${String(d.weekNummer).padStart(2, "0")}`
            }));

            setWeeks(uniqueWeeks.map(w => w.value));

            // Standaard slider range: eerste en laatste week
            setSliderRange([uniqueWeeks[0].value, uniqueWeeks[uniqueWeeks.length - 1].value]);

            // Standaard alle soorten tonen (maar alleen als ze niet allemaal 0 zijn)
            const uniekeSoorten = Array.from(new Set(transformedData.map(d => d.soort).filter(Boolean))) as string[];
            setSelectedSoorten(uniekeSoorten);

            updateChartData(transformedData, uniekeSoorten, uniqueWeeks[0].value, uniqueWeeks[uniqueWeeks.length - 1].value);
        }
        fetchData();
    }, []);

    const updateChartData = (dataset: QSMGroei[], selectedSoorten: string[], startIndex: number, endIndex: number) => {
        const minJaar = dataset[0]?.jaar ?? 2024;
        const startJaar = minJaar + Math.floor(startIndex / 52);
        const startWeek = startIndex % 52 + 1;
        const endJaar = minJaar + Math.floor(endIndex / 52);
        const endWeek = endIndex % 52 + 1;

        const filteredData = dataset.filter(d =>
            (d.jaar > startJaar || (d.jaar === startJaar && d.weekNummer >= startWeek)) &&
            (d.jaar < endJaar || (d.jaar === endJaar && d.weekNummer <= endWeek))
        );

        const labels = Array.from(new Set(filteredData.map(d => d.jaarWeek).filter(Boolean))) as string[];

        const datasets = selectedSoorten
            .map((soort, index) => {
                const dataPoints = labels.map(label => {
                    const entry = filteredData.find(d => d.jaarWeek === label && d.soort === soort);
                    return entry ? entry.groei : null;
                });

                if (dataPoints.every(point => point === null || point === 0)) return null;

                return {
                    label: soort,
                    data: dataPoints,
                    borderColor: `hsl(${index * 60}, 70%, 50%)`,
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false
                };
            })
            .filter(dataset => dataset !== null);

        setChartData({
            labels,
            datasets
        });
    };

    const handleSliderChange = (value: number | number[]) => {
        if (Array.isArray(value) && value.length === 2) {
            setSliderRange([value[0], value[1]]);
            updateChartData(data, selectedSoorten, value[0], value[1]);
        }
    };

    const formatLabel = (value: number) => {
        const minJaar = data.length > 0 ? data[0].jaar : 2024;
        const jaar = minJaar + Math.floor(value / 52);
        const week = value % 52 + 1;
        return `${jaar}-W${String(week).padStart(2, "0")}`;
    };

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-black">
                <Header />
                <div className="container mx-auto px-6 py-10">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl font-bold mb-6 text-center">QSM Groei Overzicht</h1>

                        {/* Dynamische slider */}
                        <div className="flex flex-col items-center mb-6">
                            <label className="font-bold mb-2">Selecteer periode</label>
                            <div className="w-full max-w-xl">
                                <Slider
                                    range
                                    min={0}
                                    max={weeks.length > 0 ? weeks[weeks.length - 1] : 52}
                                    step={1}
                                    value={sliderRange}
                                    onChange={handleSliderChange}
                                    trackStyle={[{ backgroundColor: "green" }]}
                                    handleStyle={[{ borderColor: "green" }, { borderColor: "green" }]}
                                    railStyle={{ backgroundColor: "lightgray" }}
                                />
                            </div>
                            <p className="mt-4 text-lg font-semibold">
                                Van: {formatLabel(sliderRange[0])}
                                {"  "}
                                Tot: {formatLabel(sliderRange[1])}
                            </p>
                        </div>

                        {/* Grafiek */}
                        <div className="w-full h-[500px] bg-white p-4 rounded-lg">
                            {chartData && chartData.datasets.length > 0 ? (
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: { title: { display: true, text: "Jaar + Weeknummer" } },
                                            y: { title: { display: true, text: "Groei" } }
                                        }
                                    }}
                                />
                            ) : (
                                <p className="text-center text-gray-500 mt-6">Geen data beschikbaar voor de geselecteerde periode.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}
