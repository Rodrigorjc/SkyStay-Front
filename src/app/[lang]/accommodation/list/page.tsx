"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import AccommodationCard from "../components/AccommodationCard";
import AccommodationFilters from "../components/AccommodationFilters";
import { fetchAccommodations } from "../services/accommodationService";
import { Accommodation } from "../types/Accommodation";
import { FaSpinner, FaFilter, FaMapMarkerAlt, FaSort, FaTimes } from "react-icons/fa";
import AccommodationSearchBar from "@/app/[lang]/accommodation/components/AccommodationSearchBar";
import { useDictionary } from "@context";

interface Filters {
  priceRange: [number, number];
  accommodationTypes: string[];
  stars: number[];
  amenities: string[];
}

export default function Results() {
  const { dict } = useDictionary();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "es";
  const [loading, setLoading] = useState(true);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("relevance");

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setLoading(true);
        // Crear params aquí directamente
        const currentParams = Object.fromEntries(searchParams as any);
        const data = await fetchAccommodations(currentParams);
        setAccommodations(data);
        setFilteredAccommodations(data);
        setIsFiltered(false);
        setError(null);
      } catch (err) {
        setError(dict?.CLIENT?.RESULTS?.ERROR?.LOAD || "Error loading accommodations");
        setAccommodations([]);
        setFilteredAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar si dict está disponible
    if (dict) {
      loadAccommodations();
    }
  }, [searchParams, dict]); // Solo searchParams y dict

  // Crear params solo cuando se necesite para display
  const params = useMemo(() => {
    return Object.fromEntries(searchParams as any);
  }, [searchParams]);

  // Función de ordenación corregida
  const handleSort = useCallback(
    (sortType: string) => {
      setSortBy(sortType);

      const dataToSort = isFiltered ? filteredAccommodations : accommodations;
      const sorted = [...dataToSort].sort((a, b) => {
        switch (sortType) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            const ratingA = a.rating || a.averageRating || 0;
            const ratingB = b.rating || b.averageRating || 0;
            return ratingB - ratingA;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      if (isFiltered) {
        setFilteredAccommodations(sorted);
      } else {
        setAccommodations(sorted);
      }
    },
    [isFiltered, filteredAccommodations, accommodations]
  );

  // Aplicar ordenación automáticamente cuando cambian los datos
  useEffect(() => {
    if (sortBy !== "relevance" && accommodations.length > 0) {
      handleSort(sortBy);
    }
  }, [accommodations.length, handleSort, sortBy]); // Solo cuando se cargan nuevos datos

  const handleFilterChange = (filters: Filters) => {
    const filtered = accommodations.filter(accommodation => {
      if (accommodation.price < filters.priceRange[0] || accommodation.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.accommodationTypes.length > 0 && (!accommodation.type || !filters.accommodationTypes.includes(accommodation.type))) {
        return false;
      }
      if (filters.stars && filters.stars.length > 0) {
        if (!accommodation.rating || !filters.stars.includes(accommodation.rating)) {
          return false;
        }
      }
      if (filters.amenities.length > 0) {
        if (!accommodation.amenities) {
          return false;
        }
        const amenitiesList = Array.isArray(accommodation.amenities) ? accommodation.amenities : [accommodation.amenities];
        for (const amenity of filters.amenities) {
          const hasAmenity = amenitiesList.some(a => typeof a === "string" && a.toLowerCase().includes(amenity.toLowerCase()));
          if (!hasAmenity) {
            return false;
          }
        }
      }
      return true;
    });

    setFilteredAccommodations(filtered);
    setIsFiltered(true);

    // Aplicar ordenación a los resultados filtrados si no es relevancia
    if (sortBy !== "relevance") {
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            const ratingA = a.rating || a.averageRating || 0;
            const ratingB = b.rating || b.averageRating || 0;
            return ratingB - ratingA;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
      setFilteredAccommodations(sorted);
    }
  };

  const displayAccommodations = isFiltered ? filteredAccommodations : accommodations;
  const destination = params.destination || dict?.CLIENT.RESULTS.ALL_DESTINATIONS;

  // Renderizado condicional aquí, después de los hooks
  if (!dict || Object.keys(dict).length === 0) {
    return <></>;
  }

  return (
    <div className="min-h-screen ">
      <AccommodationSearchBar onSearch={() => {}} />

      <div className="container mx-auto py-8 px-4">
        {/* Header Section con fondo oscuro */}
        <div className="bg-zinc-800 rounded-xl shadow-xl p-6 mb-8 border border-zinc-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-glacier-400 text-xl" />
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-glacier-100">{dict.CLIENT.RESULTS.HEADING.replace("{{destination}}", destination)}</h1>
                <p className="text-glacier-300 mt-1">
                  {displayAccommodations.length} {dict.CLIENT.RESULTS.RESULTS_FOUND || "resultados encontrados"}
                </p>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-3">
              <FaSort className="text-glacier-400" />
              <select
                value={sortBy}
                onChange={e => handleSort(e.target.value)}
                className="px-4 py-2 bg-zinc-700 text-glacier-200 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-colors">
                <option value="relevance">{dict.CLIENT.RESULTS.SORT.RELEVANCE || "Relevancia"}</option>
                <option value="price-low">{dict.CLIENT.RESULTS.SORT.PRICE_LOW || "Precio: Menor a Mayor"}</option>
                <option value="price-high">{dict.CLIENT.RESULTS.SORT.PRICE_HIGH || "Precio: Mayor a Menor"}</option>
                <option value="rating">{dict.CLIENT.RESULTS.SORT.RATING || "Mejor Valorados"}</option>
                <option value="name">{dict.CLIENT.RESULTS.SORT.NAME || "Nombre A-Z"}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:flex gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                showFilters ? "bg-glacier-600 text-white shadow-lg" : "bg-zinc-800 text-glacier-200 border border-zinc-700 hover:bg-zinc-700"
              }`}>
              {showFilters ? <FaTimes /> : <FaFilter />}
              <span className="font-medium">{showFilters ? dict.CLIENT.RESULTS.FILTERS.HIDE : dict.CLIENT.RESULTS.FILTERS.SHOW}</span>
            </button>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black bg-opacity-70" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-zinc-800 shadow-2xl overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-glacier-200">{dict.CLIENT.RESULTS.FILTERS.TITLE || "Filtros"}</h3>
                      <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                        <FaTimes className="text-glacier-400" />
                      </button>
                    </div>
                    <AccommodationFilters onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
            <div className="sticky top-4">
              <AccommodationFilters onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4 xl:w-4/5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-zinc-800 rounded-xl shadow-xl">
                <FaSpinner className="animate-spin text-6xl text-glacier-400 mb-4" />
                <p className="text-glacier-300 text-lg">{dict.CLIENT.RESULTS.LOADING || "Cargando alojamientos..."}</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border-l-4 border-red-400 p-6 rounded-xl shadow-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-red-300 font-medium">{dict.CLIENT.RESULTS.ERROR.TITLE || "Error"}</h3>
                    <p className="text-red-200 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : displayAccommodations.length === 0 ? (
              <div className="text-center py-16 bg-zinc-800 rounded-xl shadow-xl">
                <div className="w-24 h-24 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaMapMarkerAlt className="text-glacier-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-glacier-200 mb-2">{dict.CLIENT.RESULTS.NO_RESULTS || "No se encontraron resultados"}</h3>
                <p className="text-glacier-400">{dict.CLIENT.RESULTS.NO_RESULTS_DESC || "Intenta ajustar tus filtros o búsqueda"}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Grid con altura uniforme */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayAccommodations.map(accommodation => (
                    <div key={accommodation.code} className="h-full">
                      <div className="h-full transform hover:scale-[1.02] transition-transform duration-200">
                        <AccommodationCard accommodation={accommodation} lang={lang} searchParams={params} truncateDescription={true} maxDescriptionLength={120} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination placeholder */}
                <div className="flex justify-center mt-12">
                  <div className="bg-zinc-800 rounded-xl shadow-xl px-6 py-3 border border-zinc-700">
                    <p className="text-glacier-300">
                      {dict.CLIENT.RESULTS.SHOWING || "Mostrando"} {displayAccommodations.length} {dict.CLIENT.RESULTS.RESULTS || "resultados"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
