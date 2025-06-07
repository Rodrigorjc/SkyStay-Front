"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import AccommodationSearchBar from "../components/AccommodationSearchBar";
import AccommodationCard from "../components/AccommodationCard";
import { fetchAccommodations } from "../services/accommodationService";
import { Accommodation } from "../types/Accommodation";
import { FaSpinner } from "react-icons/fa";

export default function Results() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "es";
    const [loading, setLoading] = useState(true);
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Convertir searchParams a objeto para usarlo en la búsqueda
    const params = Object.fromEntries(searchParams);

    useEffect(() => {
        const loadAccommodations = async () => {
            try {
                setLoading(true);
                const data = await fetchAccommodations(params);
                setAccommodations(data); // Ajuste para usar el formato mapeado en fetchAccommodations
                setError(null);
            } catch (err) {
                setError("No pudimos cargar los alojamientos. Por favor, inténtalo de nuevo.");
                setAccommodations([]);
            } finally {
                setLoading(false);
            }
        };

        loadAccommodations();
    }, [searchParams]);

    return (
        <div>
            <AccommodationSearchBar onSearch={() => {}} />
            <div className="container mx-auto py-6 px-4">
                <h2 className="text-xl font-semibold text-glacier-50 mb-6">
                    Resultados para {params?.destination || "todos los destinos"}
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <FaSpinner className="animate-spin text-4xl text-glacier-400" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                ) : accommodations.length === 0 ? (
                    <div className="text-center py-10 text-glacier-300">
                        No encontramos alojamientos que coincidan con tu búsqueda. Intenta con otros criterios.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accommodations.map((accommodation) => (
                            <AccommodationCard
                                key={accommodation.id}
                                accommodation={accommodation}
                                lang={lang}
                                searchParams={params}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}