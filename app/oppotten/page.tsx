"use client";

import React from "react";
import Header from "@/components/Header";
import ProtectedLayout from "@/components/ProtectedLayout";
import OppottenForm from "@/components//forms/oppotForm";

export default function OppottenPage() {
    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-green-100 text-gray-900 relative">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <OppottenForm />
                </div>
            </div>
        </ProtectedLayout>
    );
}
