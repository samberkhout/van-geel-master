"use client";

import React from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import ScoutingForm from "@/components/forms/ScoutForm";

export default function ScoutingPage() {
    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-gray-900 relative">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <ScoutingForm />
                </div>
            </div>
        </ProtectedLayout>
    );
}
