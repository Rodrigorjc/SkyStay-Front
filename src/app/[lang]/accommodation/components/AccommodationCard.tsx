import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaHotel, FaBuilding } from "react-icons/fa";
import { PiBuildingApartmentFill } from "react-icons/pi";

import { Accommodation } from "../types/Accommodation";

interface AccommodationCardProps {
    accommodation: Accommodation;
    lang: string;
    searchParams?: {
        checkIn?: string;
        checkOut?: string;
        adults?: number;
        children?: number;
        rooms?: number;
    };
}

export default function AccommodationCard({ accommodation, lang, searchParams }: AccommodationCardProps) {
    var href = `/${lang}/accommodation/${accommodation.id}`;
    const queryParams = new URLSearchParams();

    if (searchParams) {
        const queryParams = new URLSearchParams();

        // Asegúrate de que los valores existen y son válidos antes de añadirlos
        if (searchParams.checkIn) queryParams.append('checkIn', searchParams.checkIn);
        if (searchParams.checkOut) queryParams.append('checkOut', searchParams.checkOut);
        if (searchParams.adults !== undefined && searchParams.adults !== null)
            queryParams.append('adults', searchParams.adults.toString());
        if (searchParams.children !== undefined && searchParams.children !== null)
            queryParams.append('children', searchParams.children.toString());
        if (searchParams.rooms !== undefined && searchParams.rooms !== null)
            queryParams.append('rooms', searchParams.rooms.toString());

        if (accommodation.type) {
            queryParams.append('typeAccomodation', accommodation.type);
        }

        const queryString = queryParams.toString();
        if (queryString) {
            href += `?${queryString}`;
        }
    }

    console.log("URL final:", href);
    return (
        <Link href={href}>
            <div className="bg-glacier-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                    <Image
                        src={accommodation.image || "/placeholder.jpg"}
                        alt={accommodation.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-4 text-glacier-950">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold truncate">{accommodation.name}</h3>
                        {accommodation.type === "hotel" && (
                            <div className="flex items-center bg-glacier-600 text-white px-2 py-1 rounded text-sm">
                                <FaStar className="mr-1" />
                                <span>{accommodation.rating}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <div className="inline-flex items-center text-xs font-medium bg-glacier-200 text-glacier-800 px-2 py-1 rounded-full">
                            {accommodation.type === "hotel" ? (
                                <FaHotel className="w-3 h-3 mr-1" />
                            ) : (
                                <PiBuildingApartmentFill className="w-3 h-3 mr-1" />

                            )}
                            {accommodation.type}
                        </div>
                        <div className="flex items-center text-glacier-700 text-sm">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{accommodation.location}</span>
                        </div>
                    </div>
                    <p className="text-sm text-glacier-800 mb-3 line-clamp-2 overflow-hidden text-ellipsis">
                        {accommodation.description}
                    </p>
                    <div className="flex items-center justify-end mt-2">
                        <div className="flex items-baseline bg-glacier-100 px-3 py-1.5 rounded-lg">
                            <span className="text-xs font-medium text-glacier-600 mr-1">desde</span>
                            <span className="text-xl font-bold text-glacier-800">{accommodation.price}</span>
                            <span className="ml-1 text-xs font-medium text-glacier-600">{accommodation.currency} por noche</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}