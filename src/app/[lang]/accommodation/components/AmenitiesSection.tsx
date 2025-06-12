"use client";

import React from "react";
import { getAmenityIcon } from "@/app/[lang]/accommodation/utils/amenitiesMap";
import { useDictionary } from "@context";

interface AmenitiesSectionProps {
    amenitiesString: string;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ amenitiesString }) => {
    const { dict } = useDictionary();

    const amenitiesList = amenitiesString
        ? amenitiesString.replace(/"/g, "").split(",")
        : [];

    if (!dict || !dict.CLIENT || !dict.CLIENT.AMENITIES) return null;

    return (
        <div className="bg-zinc-700 rounded-lg shadow-md p-6 border border-glacier-700 mt-8">
            <h2 className="text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-4">
                {dict.CLIENT.AMENITIES.SECTION_TITLE}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenitiesList.map((amenity, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-zinc-600 rounded-md"
                    >
                        <div className="text-lg">
                            {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-glacier-100">
              {dict.CLIENT.AMENITIES.OPTIONS[amenity] || amenity}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmenitiesSection;
