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

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-9 md:grid-cols-12 auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[250px]">
                {destinations.slice(0, 6).map((dest, idx) => {
                    const layout = [
                        "col-span-2 sm:col-span-5 md:col-span-6 row-span-2", // grande destacado
                        "col-span-1 sm:col-span-4 md:col-span-6 row-span-1", // mediano horizontal
                        "col-span-1 sm:col-span-5 md:col-span-3 row-span-1", // mediano
                        "col-span-1 sm:col-span-4 md:col-span-3 row-span-1", // vertical rectangular
                        "col-span-1 sm:col-span-5 md:col-span-12 row-span-1",
                        "col-span-2 sm:col-span-9 md:col-span-6 row-span-2",
                    ];

                    return (
                        <Link
                            href={`/${lang}/accommodation/${dest.code}`}
                            key={dest.code || `unknown-${idx}`}
                            className={`relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-md group ${layout[idx % layout.length]}`}
                        >
                            <img
                                src={dest.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                                alt={dest.name || "Destino sin nombre"}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Efecto hover para mostrar el nombre */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                <div className="w-full p-3 sm:p-4 text-white">
                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                                        {dest.name || "Destino sin nombre"}
                                    </h3>
                                    <div className="mt-1 text-xs sm:text-sm text-gray-200 hidden sm:block">
                                        Descubre este destino
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default AccommodationCollage;