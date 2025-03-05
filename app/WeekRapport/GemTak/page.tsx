"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getGemTakData } from "@/app/actions/actions";
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
interface GemTakData {
    id: number;
    jaar: number;
    week: number;
    tak1: number | null;
    tak2: number | null;
    tak3: number | null;
    gemTakPerPlant: number | null;
    jaarWeek?: string;
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

export default function GemTakPage() {
    const [data, setData] = useState<GemTakData[]>([]);
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: []
    });

    const [weeks, setWeeks] = useState<number[]>([]);
    const [sliderRange, setSliderRange] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        async function fetchData() {
            const gemTakData = await getGemTakData();

            if (gemTakData.length === 0) return;

            const transformedData = gemTakData
                .filter(d =>
                    (d.tak1 ?? 0) !== 0 ||
                    (d.tak2 ?? 0) !== 0 ||
                    (d.tak3 ?? 0) !== 0 ||
                    (d.gemTakPerPlant ?? 0) !== 0
                )
                .map(d => ({
                    ...d,
                    jaarWeek: `${d.jaar}-W${String(d.week).padStart(2, "0")}`
                }));

            transformedData.sort((a, b) => a.jaar - b.jaar || a.week - b.week);

            setData(transformedData);

            const uniqueWeeks = transformedData.map(d => ({
                value: (d.jaar - transformedData[0].jaar) * 52 + d.week,
                label: `${d.jaar}-W${String(d.week).padStart(2, "0")}`
            }));

            setWeeks(uniqueWeeks.map(w => w.value));
            setSliderRange([uniqueWeeks[0].value, uniqueWeeks[uniqueWeeks.length - 1].value]);

            updateChartData(transformedData, uniqueWeeks[0].value, uniqueWeeks[uniqueWeeks.length - 1].value);
        }
        fetchData();
    }, []);

    const updateChartData = (dataset: GemTakData[], startIndex: number, endIndex: number) => {
        const minJaar = dataset[0]?.jaar ?? 2023;
        const startJaar = minJaar + Math.floor(startIndex / 52);
        const startWeek = startIndex % 52 + 1;
        const endJaar = minJaar + Math.floor(endIndex / 52);
        const endWeek = endIndex % 52 + 1;

        const filteredData = dataset.filter(d =>
            (d.jaar > startJaar || (d.jaar === startJaar && d.week >= startWeek)) &&
            (d.jaar < endJaar || (d.jaar === endJaar && d.week <= endWeek))
        );

        const labels = Array.from(new Set(filteredData.map(d => d.jaarWeek).filter(Boolean))) as string[];

        setChartData({
            labels,
            datasets: [
                {
                    label: "1 Tak Gemiddeld",
                    data: labels.map(label => {
                        const entry = filteredData.find(d => d.jaarWeek === label);
                        return entry ? entry.tak1 : null;
                    }),
                    borderColor: "blue",
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false,

                },
                {
                    label: "2 Tak Gemiddeld",
                    data: labels.map(label => {
                        const entry = filteredData.find(d => d.jaarWeek === label);
                        return entry ? entry.tak2 : null;
                    }),
                    borderColor: "green",
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false
                },
                {
                    label: "3 Tak Gemiddeld",
                    data: labels.map(label => {
                        const entry = filteredData.find(d => d.jaarWeek === label);
                        return entry ? entry.tak3 : null;
                    }),
                    borderColor: "red",
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false
                },
                {
                    label: "Gem. Tak/Plant",
                    data: labels.map(label => {
                        const entry = filteredData.find(d => d.jaarWeek === label);
                        return entry ? entry.gemTakPerPlant : null;
                    }),
                    borderColor: "purple",
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false
                },
                {
                    label: "Streven",
                    data: labels.map(() => 2), // Zet elk punt op 2
                    borderColor: "orange",
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        });
    };


    const handleSliderChange = (value: number | number[]) => {
        if (Array.isArray(value) && value.length === 2) {
            setSliderRange([value[0], value[1]]);
            updateChartData(data, value[0], value[1]);
        }
    };

    const formatLabel = (value: number) => {
        const minJaar = data.length > 0 ? data[0].jaar : 2023;
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
                        <h1 className="text-3xl font-bold mb-6 text-center">Gemiddelde Takken Overzicht</h1>
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
                                    trackStyle={[{backgroundColor: "green"}]}
                                    handleStyle={[{borderColor: "green"}, {borderColor: "green"}]}
                                    railStyle={{backgroundColor: "lightgray"}}
                                />
                            </div>
                            <p className="mt-4 text-lg font-semibold">
                                Van: {formatLabel(sliderRange[0])}
                                {"  "}
                                Tot: {formatLabel(sliderRange[1])}
                            </p>
                        </div>

                        <Line data={chartData!}/>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}
