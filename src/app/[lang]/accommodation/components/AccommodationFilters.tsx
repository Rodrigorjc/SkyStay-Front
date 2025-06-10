import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    FaFilter, FaHotel, FaBuilding, FaHome
} from "react-icons/fa";
import { MdRoomService as FaConcierge, MdElevator as FaElevator, MdCleaningServices as FaBroom } from "react-icons/md";
import { amenitiesOptions } from "../utils/amenitiesMap";

const accommodationTypes = [
    { id: "hotel", label: "Hotel", icon: <FaHotel className="mr-2" /> },
    { id: "apartment", label: "Apartamento", icon: <FaBuilding className="mr-2" /> },
];

interface AccommodationFiltersProps {
    className?: string;
    onFilterChange?: (filters: {
        priceRange: [number, number];
        amenities: string[];
        accommodationTypes: string[];
        stars: number | null;
    }) => void;
}

const AccommodationFilters: React.FC<AccommodationFiltersProps> = ({
                                                                       className,
                                                                       onFilterChange
                                                                   }) => {
    // Estados para los filtros
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [starsFilter, setStarsFilter] = useState<number | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onFilterChange) {
                onFilterChange({
                    priceRange: priceRange,
                    amenities: selectedAmenities,
                    accommodationTypes: selectedTypes,
                    stars: starsFilter
                });
            }
        });

        return () => clearTimeout(timeoutId);
    }, [priceRange, selectedAmenities, selectedTypes, starsFilter, onFilterChange]);

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? 0 : parseInt(e.target.value);
        if (!isNaN(value)) {
            setPriceRange([value, priceRange[1]]);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? 500 : parseInt(e.target.value);
        if (!isNaN(value)) {
            setPriceRange([priceRange[0], value]);
        }
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setPriceRange([priceRange[0], value]);
        }
    };

    // Manejar cambios en amenities
    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    // Manejar cambios en tipos de alojamiento
    const handleTypeChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    return (
        <div className={`bg-zinc-800 rounded-lg shadow-md p-4 ${className}`}>
            <div className="flex items-center mb-4 border-b border-glacier-700 pb-2">
                <FaFilter className="text-glacier-400 mr-2" />
                <h3 className="text-lg font-medium text-glacier-200">Filtros</h3>
            </div>

            {/* Filtro de precio */}
            <div className="mb-6">
                <h4 className="text-glacier-200 font-medium mb-3">Rango de precio</h4>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-glacier-300">{priceRange[0]}€</span>
                    <span className="text-sm text-glacier-300">{priceRange[1]}€</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-glacier-700 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex gap-2 mt-2">
                    <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={handleMinPriceChange}
                        className="w-1/2 px-2 py-1 text-sm bg-zinc-700 text-glacier-200 rounded border border-glacier-600"
                    />
                    <input
                        type="number"
                        min={priceRange[0]}
                        max="500"
                        value={priceRange[1]}
                        onChange={handleMaxPriceChange}
                        className="w-1/2 px-2 py-1 text-sm bg-zinc-700 text-glacier-200 rounded border border-glacier-600"
                    />
                </div>
            </div>

            {/* Filtro de tipo de alojamiento */}
            <div className="mb-6">
                <h4 className="text-glacier-200 font-medium mb-3">Tipo de alojamiento</h4>
                <div className="space-y-2">
                    {accommodationTypes.map(type => (
                        <div key={type.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`type-${type.id}`}
                                checked={selectedTypes.includes(type.id)}
                                onChange={() => handleTypeChange(type.id)}
                                className="mr-2 text-glacier-500 focus:ring-glacier-500 h-4 w-4 border-glacier-600 rounded"
                            />
                            <label htmlFor={`type-${type.id}`} className="flex items-center text-glacier-300">
                                {type.icon} {type.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filtro de estrellas */}
            <div className="mb-6">
                <h4 className="text-glacier-200 font-medium mb-3">Calificación (estrellas)</h4>
                <div className="flex space-x-2">
                    {[5, 4, 3, 2, 1].map(star => (
                        <button
                            key={star}
                            onClick={() => setStarsFilter(starsFilter === star ? null : star)}
                            className={`h-8 w-8 flex items-center justify-center rounded ${
                                starsFilter === star
                                    ? 'bg-glacier-500 text-white'
                                    : 'bg-zinc-700 text-glacier-300 hover:bg-zinc-600'
                            }`}
                        >
                            {star}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filtro de amenities */}
            <div className="mb-6">
                <h4 className="text-glacier-200 font-medium mb-3">Servicios disponibles</h4>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {amenitiesOptions.map(amenity => (
                        <div key={amenity} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`amenity-${amenity}`}
                                checked={selectedAmenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                                className="mr-2 text-glacier-500 focus:ring-glacier-500 h-4 w-4 border-glacier-600 rounded"
                            />
                            <label htmlFor={`amenity-${amenity}`} className="text-glacier-300">
                                {amenity}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AccommodationFilters;