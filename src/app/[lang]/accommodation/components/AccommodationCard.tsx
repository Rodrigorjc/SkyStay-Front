import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaHotel, FaTrophy, FaHeart, FaRegHeart } from "react-icons/fa";
import { PiBuildingApartmentFill } from "react-icons/pi";
import Cookies from "js-cookie";
import { Accommodation } from "../types/Accommodation";
import { toggleFavoriteAccommodation } from "../services/accommodationService";
import NotificationComponent from "@components/Notification";
import {Notifications} from "@/app/interfaces/Notifications";

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
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState("");
    const [notification, setNotification] = useState<Notifications>();


    useEffect(() => {
        if (accommodation.isFavorite !== undefined) {
            setIsFavorite(accommodation.isFavorite);
        }
    }, [accommodation.isFavorite]);

    const animations = [
        "animate-heartBeat",
        "animate-ripple",
        "animate-rotate",
        "animate-confetti",
        "animate-bounce-custom",
        "animate-pulseGlow"
    ];

    const getRandomAnimation = () => {
        const randomIndex = Math.floor(Math.random() * animations.length);
        return animations[randomIndex];
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = Cookies.get('token');

        if (!token) {
            const notificacion: Notifications = {
                titulo: "Inicio de sesión requerido",
                mensaje: "Debes iniciar sesión para guardar alojamientos en favoritos",
                code: 401,
                tipo: "warning"
            };

            setNotification(notificacion);
            setTimeout(() => {
                setNotification(undefined);
            }, 2000);
            return;
        }

        if (isLoading) return;

        setIsLoading(true);

        const randomAnimation = getRandomAnimation();
        setCurrentAnimation(randomAnimation);
        setIsAnimating(true);

        try {
            await toggleFavoriteAccommodation(accommodation.code, accommodation.type, isFavorite);
            setIsFavorite(!isFavorite);

            setTimeout(() => {
                setIsAnimating(false);
            }, 1000);
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            setIsAnimating(false);

            const notificacionError: Notifications = {
                titulo: "Error",
                mensaje: "No se pudo actualizar el favorito",
                code: 500,
                tipo: "error"
            };
            setNotification(notificacionError);
        } finally {
            setIsLoading(false);
        }
    };

    var href = `/${lang}/accommodation/${accommodation.code}`;

    if (searchParams) {
        const queryParams = new URLSearchParams();

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

    return (
        <div className="relative group">
            <Link href={href}>
                <div className="bg-zinc-800/80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-glacier-600">
                    <div className="relative h-48 group">
                        <Image
                            src={accommodation.image || "/placeholder.jpg"}
                            alt={accommodation.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {accommodation.averageRating && (
                            <div className="absolute top-2 right-2 flex items-center bg-glacier-900 text-white px-2 py-1 rounded-md text-sm shadow-md gap-0.5">
                                <FaTrophy className="mr-1 text-yellow-400" />
                                <span className="font-medium">{accommodation.averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 text-glacier-200">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold truncate text-white">{accommodation.name}</h3>
                            {accommodation.type === "hotel" && accommodation.rating && (
                                <div className="flex items-center text-yellow-400">
                                    {Array.from({ length: accommodation.rating }).map((_, i) => (
                                        <FaStar key={i} className="w-3.5 h-3.5" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <div className="inline-flex items-center text-xs font-medium bg-glacier-700 text-glacier-200 px-2 py-1 rounded-full">
                                {accommodation.type === "hotel" ? (
                                    <FaHotel className="w-3 h-3 mr-1 text-glacier-400" />
                                ) : (
                                    <PiBuildingApartmentFill className="w-3 h-3 mr-1 text-glacier-400" />
                                )}
                                <span className="capitalize">{accommodation.type}</span>
                            </div>
                            <div className="flex items-center text-glacier-200 text-sm">
                                <FaMapMarkerAlt className="mr-1 text-glacier-300" />
                                <span>{accommodation.location}</span>
                            </div>
                        </div>
                        <p className="text-sm text-glacier-200 mb-3 line-clamp-2 overflow-hidden text-ellipsis">
                            {accommodation.description}
                        </p>
                        <div className="flex items-center justify-end mt-3">
                            <div className="flex items-baseline bg-glacier-900 px-3 py-1.5 rounded-lg border border-glacier-700">
                                <span className="text-xs font-medium text-glacier-200 mr-1">desde</span>
                                <span className="text-xl font-bold text-glacier-100">{accommodation.price}</span>
                                <span className="ml-1 text-xs font-medium text-glacier-200">{accommodation.currency} /noche</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Botón de favorito */}
            <button
                onClick={handleToggleFavorite}
                className={`absolute top-3 left-3 z-10 p-2 rounded-full bg-zinc-800/80 hover:bg-opacity-70 transition-all duration-300`}
                aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
                <div className={`${isAnimating ? currentAnimation : ''}`}>
                    {isFavorite ? (
                        <FaHeart className="text-red-500 text-xl" />
                    ) : (
                        <FaRegHeart className="text-white text-xl hover:text-red-200" />
                    )}
                </div>
            </button>

            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
        </div>
    );
}