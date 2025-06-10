import { useState, useEffect } from "react";
import {
    FaFilter, FaHotel, FaBuilding
} from "react-icons/fa";
import { amenitiesOptions } from "../utils/amenitiesMap";
import { FaStar, FaRegStar } from "react-icons/fa";

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
        stars: number[] | null;
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
    const [starsFilter, setStarsFilter] = useState<number[]>([]);

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

    const handleStarFilter = (star: number) => {
        setStarsFilter(prev =>
            prev.includes(star)
                ? prev.filter(s => s !== star)
                : [...prev, star]
        );
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
        <div className={`bg-zinc-800/80 rounded-lg p-4 ${className}`}>
            <div className="max-h-[70vh] overflow-y-auto pr-6 custom-scrollbar">
                <div className="flex items-center mb-4 border-b border-glacier-700 pb-2">
                    <FaFilter className="text-glacier-400 mr-2"/>
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

                {/* Filtro de estrellas - multiopción */}
                <div className="mb-6">
                    <h4 className="text-glacier-200 font-medium mb-3">Calificación</h4>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div
                                key={star}
                                onClick={() => handleStarFilter(star)}
                                className={`flex items-center p-2 rounded-md cursor-pointer transition-all ${
                                    starsFilter.includes(star)
                                        ? 'bg-glacier-600 border border-glacier-400'
                                        : 'bg-zinc-700 border border-zinc-600 hover:bg-zinc-600'
                                }`}
                            >
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <span key={index}>
                                            {index < star ?
                                                <FaStar className="mr-1" /> :
                                                <FaRegStar className="mr-1 text-zinc-500" />
                                            }
                                        </span>
                                    ))}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    starsFilter.includes(star) ? 'text-white font-medium' : 'text-glacier-300'
                                    }`}>
                                    {star} {star === 1 ? 'estrella' : 'estrellas'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filtro de amenities */}
                <div className="mb-6">
                    <h4 className="text-glacier-200 font-medium mb-3">Servicios disponibles</h4>
                    <div className="pr-2 grid grid-cols-1 sm:grid-cols-1 gap-3">
                        {amenitiesOptions.map(amenity => (
                            <div
                                key={amenity}
                                onClick={() => handleAmenityChange(amenity)}
                                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                                    selectedAmenities.includes(amenity)
                                        ? 'bg-glacier-600 border border-glacier-400'
                                        : 'bg-zinc-700 border border-zinc-600 hover:bg-zinc-600'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    id={`amenity-${amenity}`}
                                    checked={selectedAmenities.includes(amenity)}
                                    onChange={() => {}} // Gestionado por el onClick del div
                                    className="mr-2 text-glacier-500 focus:ring-glacier-500 h-4 w-4 border-glacier-600 rounded accent-glacier-500"
                                />
                                <label
                                    htmlFor={`amenity-${amenity}`}
                                    className={`text-sm cursor-pointer ${
                                        selectedAmenities.includes(amenity) ? 'text-white font-medium' : 'text-glacier-300'
                                    }`}
                                >
                                    {amenity}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccommodationFilters;