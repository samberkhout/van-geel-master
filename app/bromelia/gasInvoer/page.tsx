"use client";

import React from "react";
import Header from "@/components/HeaderBromelia";
import ProtectedLayout from "@/components/ProtectedLayout";
import GasForm from "@/components/forms/gasForm";

export default function LeveringPage() {
    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-blue-100 text-gray-900 relative">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <GasForm />
                </div>
            </div>
        </ProtectedLayout>
    );
}
