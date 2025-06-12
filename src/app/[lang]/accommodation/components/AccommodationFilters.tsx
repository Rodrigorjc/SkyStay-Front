"use client";
import React, { useState, useEffect } from "react";
import { FaFilter, FaHotel, FaBuilding, FaStar, FaRegStar } from "react-icons/fa";
import { amenitiesOptions } from "../utils/amenitiesMap";
import { useDictionary } from "@context";

const accommodationTypes = [
    { id: "hotel", labelKey: "HOTEL", icon: <FaHotel className="mr-2" /> },
    { id: "apartment", labelKey: "APARTMENT", icon: <FaBuilding className="mr-2" /> },
];

interface AccommodationFiltersProps {
    className?: string;
    onFilterChange?: (filters: {
        priceRange: [number, number];
        amenities: string[];
        accommodationTypes: string[];
        stars: number[];
    }) => void;
}

export default function AccommodationFilters({
                                                 className = "",
                                                 onFilterChange,
                                             }: AccommodationFiltersProps) {
    const { dict } = useDictionary();
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [starsFilter, setStarsFilter] = useState<number[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onFilterChange?.({
                priceRange,
                amenities: selectedAmenities,
                accommodationTypes: selectedTypes,
                stars: starsFilter,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [priceRange, selectedAmenities, selectedTypes, starsFilter, onFilterChange]);

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const min = parseInt(e.target.value) || 0;
        setPriceRange([min, priceRange[1]]);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const max = parseInt(e.target.value) || 500;
        setPriceRange([priceRange[0], max]);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const max = parseInt(e.target.value) || 0;
        setPriceRange([priceRange[0], max]);
    };

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const handleTypeChange = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleStarFilter = (star: number) => {
        setStarsFilter(prev =>
            prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
        );
    };

    return (
        <div className={`bg-zinc-800/80 rounded-lg p-4 ${className}`}>
            <div className="max-h-[70vh] overflow-y-auto pr-6 custom-scrollbar">
                <div className="flex items-center mb-4 border-b border-glacier-700 pb-2">
                    <FaFilter className="text-glacier-400 mr-2" />
                    <h3 className="text-lg font-medium text-glacier-200">{dict.CLIENT.FILTERS.TITLE}</h3>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.PRICE_RANGE}</h4>
                    <div className="flex justify-between mb-2 text-sm text-glacier-300">
                        <span>{priceRange[0]}€</span>
                        <span>{priceRange[1]}€</span>
                    </div>
                    <input
                        type="range"
                        min={dict.CLIENT.FILTERS.PRICE_MIN}
                        max={dict.CLIENT.FILTERS.PRICE_MAX}
                        step={dict.CLIENT.FILTERS.PRICE_STEP}
                        value={priceRange[1]}
                        onChange={handleRangeChange}
                        className="w-full h-2 bg-glacier-700 rounded-lg"
                    />
                    <div className="flex gap-2 mt-2">
                        <input
                            type="number"
                            min={dict.CLIENT.FILTERS.PRICE_MIN}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={handleMinPriceChange}
                            className="w-1/2 px-2 py-1 text-sm bg-zinc-700 text-glacier-200 rounded border border-glacier-600"
                        />
                        <input
                            type="number"
                            min={priceRange[0]}
                            max={dict.CLIENT.FILTERS.PRICE_MAX}
                            value={priceRange[1]}
                            onChange={handleMaxPriceChange}
                            className="w-1/2 px-2 py-1 text-sm bg-zinc-700 text-glacier-200 rounded border border-glacier-600"
                        />
                    </div>
                </div>

                {/* Accommodation Types */}
                <div className="mb-6">
                    <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.TYPE_TITLE}</h4>
                    <div className="space-y-2">
                        {accommodationTypes.map(type => (
                            <div key={type.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedTypes.includes(type.id)}
                                    onChange={() => handleTypeChange(type.id)}
                                    className="mr-2 text-glacier-500 focus:ring-glacier-500 h-4 w-4 border-glacier-600 rounded"
                                />
                                <label className="flex items-center text-glacier-300">
                                    {type.icon} {dict.CLIENT.FILTERS.TYPE_OPTIONS[type.labelKey]}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stars */}
                <div className="mb-6">
                    <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.STARS_TITLE}</h4>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div
                                key={star}
                                onClick={() => handleStarFilter(star)}
                                className={`flex items-center p-2 rounded-md cursor-pointer transition-all \${
                  starsFilter.includes(star)
                    ? 'bg-glacier-600 border border-glacier-400'
                    : 'bg-zinc-700 border border-zinc-600 hover:bg-zinc-600'
                }`}
                            >
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        i < star ? <FaStar key={i} className="mr-1" /> : <FaRegStar key={i} className="mr-1 text-zinc-500" />
                                    ))}
                                </div>
                                <span className={`ml-2 text-sm \${
                  starsFilter.includes(star) ? 'text-white font-medium' : 'text-glacier-300'
                }`}>{star} {star === 1 ? dict.CLIENT.FILTERS.STARS_SINGULAR : dict.CLIENT.FILTERS.STARS_PLURAL}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                    <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.AMENITIES_TITLE}</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {amenitiesOptions.map(amenity => (
                            <label
                                key={amenity}
                                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors \${
                  selectedAmenities.includes(amenity)
                    ? 'bg-glacier-600 border border-glacier-400 text-white'
                    : 'bg-zinc-700 border border-zinc-600 text-glacier-300 hover:bg-zinc-600'
                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(amenity)}
                                    onChange={() => handleAmenityChange(amenity)}
                                    className="mr-2 accent-glacier-500 h-4 w-4 rounded"
                                />
                                <span className="text-sm">{dict.CLIENT.FILTERS.AMENITIES_OPTIONS[amenity]}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
