"use client";
import React, { useEffect, useState } from "react";
import AccommodationSearchBar from "@/app/[lang]/accommodation/components/AccommodationSearchBar";
import Navbar from "@components/Navbar";
import { fetchDictionary } from "@dictionary";

interface AccommodationLayoutProps {
    children: React.ReactNode;
}

export default function AccommodationLayout({ children }: AccommodationLayoutProps) {
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
        const loadDictionary = async () => {
            const dict = await fetchDictionary();
            setDictionary(dict);
        };

        loadDictionary();
    }, []);

    return (
        <div className="bg-gradient-to-t from-glacier-950 via-zinc-900 to-glacier-900 bg-blend-exclusion">
            {dictionary && <Navbar dict={dictionary}></Navbar>}
            {children}
        </div>
    );
}