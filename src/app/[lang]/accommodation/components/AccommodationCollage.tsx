"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDestinations } from "@/app/[lang]/accommodation/services/accommodationService";

interface Destination {
    code: string;
    name: string;
    image: string | null;
}

const AccommodationCollage = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useParams();


    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await getDestinations();
                if (Array.isArray(data)) {
                    setDestinations(data);
                } else {
                    setDestinations([]);
                }
            } catch (error) {
                console.error("Error al obtener los destinos:", error);
                setDestinations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    if (loading) return <p className="text-center text-white mt-6">Cargando destinos...</p>;

    return (
        <section className="mt-10 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8 text-white">Destinos sugeridos</h2>

            <div className="grid gap-4 grid-cols-12 auto-rows-[200px] md:auto-rows-[250px]">
                {destinations.slice(0, 6).map((dest, idx) => {
                    const layout = [
                        "col-span-6 row-span-2", // imagen grande
                        "col-span-3 row-span-1", // imagen horizontal pequeña
                        "col-span-3 row-span-1", // horizontal
                        "col-span-6 row-span-2", // vertical
                        "col-span-6 row-span-1", // horizontal mediana
                        "col-span-4 row-span-1", // horizontal
                    ];

                    return (
                        <Link
                            href={`/${lang}/accommodation/${dest.code}`}
                            key={dest.code || `unknown-${idx}`}
                            className={`relative overflow-hidden rounded-2xl shadow-md group ${layout[idx % layout.length]}`}
                        >
                            <img
                                src={dest.image!}
                                alt={dest.name || "Destino sin nombre"}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 text-white text-sm font-medium">
                                {dest.name || "Destino sin nombre"}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default AccommodationCollage;