import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { Accommodation } from "../types/Accommodation";

interface AccommodationCardProps {
    accommodation: Accommodation;
    lang: string;
}

export default function AccommodationCard({ accommodation, lang }: AccommodationCardProps) {
    return (
        <Link href={`/${lang}/accommodation/${accommodation.id}`}>
            <div className="bg-glacier-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                    <Image
                        src={accommodation.images[0] || "/placeholder.jpg"}
                        alt={accommodation.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-4 text-glacier-950">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold truncate">{accommodation.name}</h3>
                        <div className="flex items-center bg-glacier-600 text-white px-2 py-1 rounded text-sm">
                            <FaStar className="mr-1" />
                            <span>{accommodation.rating}</span>
                        </div>
                    </div>
                    <div className="flex items-center text-glacier-700 mb-3 text-sm">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{accommodation.location}</span>
                    </div>
                    <p className="text-sm text-glacier-800 mb-3 line-clamp-2">{accommodation.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline">
                            <span className="text-lg font-bold text-glacier-800">{accommodation.price}</span>
                            <span className="ml-1 text-sm text-glacier-600">{accommodation.currency}</span>
                        </div>
                        <span className="text-sm text-glacier-600">por noche</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}