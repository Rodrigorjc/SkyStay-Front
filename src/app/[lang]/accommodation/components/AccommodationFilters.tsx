"use client";
import React, { useState, useEffect } from "react";
import { FaFilter, FaHotel, FaBuilding, FaStar } from "react-icons/fa";
import { amenitiesOptions } from "../utils/amenitiesMap";
import { useDictionary } from "@context";

const accommodationTypes = [
  { id: "hotel", labelKey: "HOTEL", icon: <FaHotel className="w-4 h-4" /> },
  { id: "apartment", labelKey: "APARTMENT", icon: <FaBuilding className="w-4 h-4" /> },
];

interface AccommodationFiltersProps {
  className?: string;
  onFilterChange?: (filters: { priceRange: [number, number]; amenities: string[]; accommodationTypes: string[]; stars: number[] }) => void;
}

export default function AccommodationFilters({ className = "", onFilterChange }: AccommodationFiltersProps) {
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
    // Asegurar que el mínimo no sea mayor que el máximo
    if (priceRange[0] > max) {
      setPriceRange([max - 10, max]);
    } else {
      setPriceRange([priceRange[0], max]);
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => (prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]));
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => (prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]));
  };

  const handleStarFilter = (star: number) => {
    setStarsFilter(prev => (prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]));
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

          {/* Valores actuales con mejor styling */}
          <div className="flex justify-between items-center mb-4">
            <div className="bg-glacier-700 px-3 py-1.5 rounded-lg">
              <span className="text-glacier-100 font-semibold">{priceRange[0]}€</span>
            </div>
            <div className="flex-1 mx-3 border-t border-glacier-600"></div>
            <div className="bg-glacier-700 px-3 py-1.5 rounded-lg">
              <span className="text-glacier-100 font-semibold">{priceRange[1]}€</span>
            </div>
          </div>

          {/* Range slider simplificado */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="range"
                min={dict.CLIENT.FILTERS.PRICE_MIN || 0}
                max={dict.CLIENT.FILTERS.PRICE_MAX || 1000}
                step={dict.CLIENT.FILTERS.PRICE_STEP || 10}
                value={priceRange[1]}
                onChange={handleRangeChange}
                className="w-full h-3 bg-glacier-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-glacier-500"
                style={{
                  background: `linear-gradient(to right, #374151 0%, #374151 ${(priceRange[0] / (dict.CLIENT.FILTERS.PRICE_MAX || 1000)) * 100}%, #0891b2 ${
                    (priceRange[0] / (dict.CLIENT.FILTERS.PRICE_MAX || 1000)) * 100
                  }%, #0891b2 ${(priceRange[1] / (dict.CLIENT.FILTERS.PRICE_MAX || 1000)) * 100}%, #374151 ${(priceRange[1] / (dict.CLIENT.FILTERS.PRICE_MAX || 1000)) * 100}%, #374151 100%)`,
                }}
              />
            </div>

            {/* Indicadores visuales del rango */}
            <div className="flex justify-between mt-2 text-xs text-glacier-400">
              <span>{dict.CLIENT.FILTERS.PRICE_MIN || 0}€</span>
              <span>{dict.CLIENT.FILTERS.PRICE_MAX || 1000}€</span>
            </div>
          </div>

          {/* Inputs numéricos mejorados */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-xs text-glacier-400 mb-1">{dict.CLIENT.FILTERS.MIN_PRICE || "Mínimo"}</label>
              <div className="relative">
                <input
                  type="number"
                  min={dict.CLIENT.FILTERS.PRICE_MIN || 0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={handleMinPriceChange}
                  className="w-full pl-3 pr-8 py-2 text-sm bg-zinc-700 text-glacier-200 rounded-lg border border-glacier-600 focus:border-glacier-500 focus:ring-1 focus:ring-glacier-500 transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glacier-400 text-sm">€</span>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs text-glacier-400 mb-1">{dict.CLIENT.FILTERS.MAX_PRICE || "Máximo"}</label>
              <div className="relative">
                <input
                  type="number"
                  min={priceRange[0]}
                  max={dict.CLIENT.FILTERS.PRICE_MAX || 1000}
                  value={priceRange[1]}
                  onChange={handleMaxPriceChange}
                  className="w-full pl-3 pr-8 py-2 text-sm bg-zinc-700 text-glacier-200 rounded-lg border border-glacier-600 focus:border-glacier-500 focus:ring-1 focus:ring-glacier-500 transition-colors"
                  placeholder="1000"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glacier-400 text-sm">€</span>
              </div>
            </div>
          </div>

          {/* Botones de rangos predefinidos */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              [0, 50],
              [50, 100],
              [100, 200],
              [200, 500],
            ].map(([min, max]) => (
              <button
                key={`${min}-${max}`}
                onClick={() => setPriceRange([min, max])}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  priceRange[0] === min && priceRange[1] === max ? "bg-glacier-600 text-white" : "bg-zinc-700 text-glacier-300 hover:bg-zinc-600"
                }`}>
                {min}€ - {max}€
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Types */}
        <div className="mb-5">
          <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.TYPE_TITLE}</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {accommodationTypes.map(type => (
              <label
                key={type.id}
                className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTypes.includes(type.id)
                    ? "bg-glacier-600 border border-glacier-500 text-white shadow-sm"
                    : "bg-zinc-750 border border-zinc-600 text-glacier-300 hover:bg-zinc-700 hover:border-zinc-550"
                }`}>
                <input type="checkbox" checked={selectedTypes.includes(type.id)} onChange={() => handleTypeChange(type.id)} className="mr-2.5 accent-glacier-400 h-4 w-4 rounded" />
                <div className="flex items-center">
                  <span className={`mr-2.5 ${selectedTypes.includes(type.id) ? "text-glacier-200" : "text-glacier-400"}`}>{type.icon}</span>
                  <span className={`text-sm font-medium ${selectedTypes.includes(type.id) ? "text-white" : "text-glacier-300"}`}>{dict.CLIENT.FILTERS.TYPE_OPTIONS[type.labelKey]}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Stars */}
        <div className="mb-5">
          <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.STARS_TITLE}</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {[5, 4, 3, 2, 1].map(star => (
              <label
                key={star}
                className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  starsFilter.includes(star)
                    ? "bg-glacier-600 border border-glacier-500 text-white shadow-sm"
                    : "bg-zinc-750 border border-zinc-600 text-glacier-300 hover:bg-zinc-700 hover:border-zinc-550"
                }`}>
                <input
                  type="checkbox"
                  checked={starsFilter.includes(star)}
                  onChange={() => setStarsFilter(prev => (prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]))}
                  className="mr-2.5 accent-glacier-400 h-4 w-4 rounded"
                />
                <div className="flex items-center">
                  {[...Array(star)].map((_, i) => (
                    <FaStar key={i} className={`w-4 h-4 ${starsFilter.includes(star) ? "text-yellow-300" : "text-yellow-400"}`} />
                  ))}
                  <span className={`ml-2.5 text-sm font-medium ${starsFilter.includes(star) ? "text-white" : "text-glacier-300"}`}>
                    {star} {star === 1 ? dict.CLIENT.FILTERS.STAR : dict.CLIENT.FILTERS.STARS}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-5">
          <h4 className="text-glacier-200 font-medium mb-3">{dict.CLIENT.FILTERS.AMENITIES_TITLE}</h4>
          <div className="grid grid-cols-1 gap-2.5">
            {amenitiesOptions.map(amenity => (
              <label
                key={amenity}
                className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAmenities.includes(amenity)
                    ? "bg-glacier-600 border border-glacier-500 text-white shadow-sm"
                    : "bg-zinc-750 border border-zinc-600 text-glacier-300 hover:bg-zinc-700 hover:border-zinc-550"
                }`}>
                <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="mr-2.5 accent-glacier-400 h-4 w-4 rounded" />
                <span className={`text-sm font-medium ${selectedAmenities.includes(amenity) ? "text-white" : "text-glacier-300"}`}>{dict.CLIENT.FILTERS.AMENITIES_OPTIONS[amenity]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
