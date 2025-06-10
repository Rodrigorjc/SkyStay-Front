"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import AccommodationCard from "../components/AccommodationCard";
import AccommodationFilters from "../components/AccommodationFilters";
import { fetchAccommodations } from "../services/accommodationService";
import { Accommodation } from "../types/Accommodation";
import { FaSpinner, FaFilter } from "react-icons/fa";

interface Filters {
    priceRange: [number, number];
    accommodationTypes: string[];
    stars: number[];
    amenities: string[];
}

export default function Results() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "es";
    const [loading, setLoading] = useState(true);
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Convertir searchParams a objeto para usarlo en la búsqueda
    const params = Object.fromEntries(searchParams);

    useEffect(() => {
        const loadAccommodations = async () => {
            try {
                setLoading(true);
                const data = await fetchAccommodations(params);
                setAccommodations(data);
                setFilteredAccommodations(data); // Inicializa los alojamientos filtrados con todos los alojamientos
                setIsFiltered(false); // Resetea el estado de filtrado
                setError(null);
            } catch (err) {
                setError("No pudimos cargar los alojamientos. Por favor, inténtalo de nuevo.");
                setAccommodations([]);
                setFilteredAccommodations([]);
            } finally {
                setLoading(false);
            }
        };

        loadAccommodations();
    }, [searchParams]);

    const handleFilterChange = (filters: Filters) => {
        const filtered = accommodations.filter(accommodation => {
            // Filtro de precio
            if (accommodation.price < filters.priceRange[0] ||
                accommodation.price > filters.priceRange[1]) {
                return false;
            }

            // Filtro de tipo de alojamiento
            if (filters.accommodationTypes.length > 0 &&
                (!accommodation.type || !filters.accommodationTypes.includes(accommodation.type))) {
                return false;
            }


            if (filters.stars && filters.stars.length > 0) {
                // Si el alojamiento no tiene rating o no está en el array de estrellas seleccionadas
                if (!accommodation.rating || !filters.stars.includes(accommodation.rating)) {
                    return false;
                }
            }

            // Filtro de amenities (que ya funciona)
            if (filters.amenities.length > 0) {
                if (!accommodation.amenities) {
                    return false;
                }

                const amenitiesList = Array.isArray(accommodation.amenities)
                    ? accommodation.amenities
                    : [accommodation.amenities];

                for (const amenity of filters.amenities) {
                    const hasAmenity = amenitiesList.some(a =>
                        typeof a === 'string' &&
                        a.toLowerCase().includes(amenity.toLowerCase())
                    );

                    if (!hasAmenity) {
                        return false;
                    }
                }
            }

            return true;
        });

        setFilteredAccommodations(filtered);
        setIsFiltered(true);
    };

    // Determina qué lista de alojamientos mostrar
    const displayAccommodations = isFiltered ? filteredAccommodations : accommodations;

    return (
        <div>

            <div className="container mx-auto py-6 px-4">
                <h2 className="text-xl font-semibold text-glacier-50 mb-6">
                    Resultados para {params?.destination || "todos los destinos"}
                </h2>

                <div className="lg:flex gap-6">
                    {/* Filtros - Solo visible en móvil cuando está expandido */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-glacier-200 rounded flex items-center justify-center"
                        >
                            <FaFilter className="mr-2" />
                            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                        </button>

                        {showFilters && (
                            <AccommodationFilters onFilterChange={handleFilterChange} />
                        )}
                    </div>

                    {/* Filtros - Siempre visible en escritorio */}
                    <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
                        <AccommodationFilters onFilterChange={handleFilterChange} />
                    </div>

                    {/* Resultados */}
                    <div className="lg:w-3/4 xl:w-4/5">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <FaSpinner className="animate-spin text-4xl text-glacier-400" />
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                <p>{error}</p>
                            </div>
                        ) : displayAccommodations.length === 0 ? (
                            <div className="text-center py-10 text-glacier-300">
                                No encontramos alojamientos que coincidan con tu búsqueda. Intenta con otros criterios.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {displayAccommodations.map((accommodation) => (
                                    <AccommodationCard
                                        key={accommodation.code}
                                        accommodation={accommodation}
                                        lang={lang}
                                        searchParams={params}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}