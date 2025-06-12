"use client";
import React, {JSX, useEffect, useState} from "react";
import {useParams, usePathname, useSearchParams} from "next/navigation";
import { getAccommodationDetails } from "@/app/[lang]/accommodation/services/accommodationService";
import Image from "next/image";
import Cookies from "js-cookie";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toggleFavoriteAccommodation } from "@/app/[lang]/accommodation/services/accommodationService";
import { FaImages, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaWifi, FaStar, FaSwimmingPool, FaDumbbell, FaCoffee, FaTv, FaParking, FaSpa, FaUtensils, FaWind, FaCocktail, FaTrophy } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from "next/navigation";
import { getAmenityIcon } from "@/app/[lang]/accommodation/utils/amenitiesMap";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";


interface Room {
    availableCount: number;
    capacity: number;
    roomConfigId: number;
    roomType: string;
    price: number;
}

interface AccommodationDetails {
    name: string;
    description: string;
    images: string[];
    address: string;
    cityName: string;
    countryName: string;
    email: string;
    phoneNumber: string;
    postalCode: string;
    stars: number;
    website: string;
    availableRooms: Room[];
    amenities: string;
    accommodationType: string;
    code: string;
    averageRating?: number;
    isFavorite?: boolean;
}

export default function AccommodationPage() {
    const { code, lang } = useParams() as { code: string; lang: string };
    const [details, setDetails] = useState<AccommodationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: number }>({});
    const [showGallery, setShowGallery] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<Notifications>();
    const [currentAnimation, setCurrentAnimation] = useState("");
    const router = useRouter();


    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const loadAccommodationDetails = async () => {
            try {
                const params = {
                    checkIn: searchParams.get('checkIn') || undefined,
                    checkOut: searchParams.get('checkOut') || undefined,
                    adults: searchParams.has('adults') ? parseInt(searchParams.get('adults') || '0') : undefined,
                    children: searchParams.has('children') ? parseInt(searchParams.get('children') || '0') : undefined,
                    rooms: searchParams.has('rooms') ? parseInt(searchParams.get('rooms') || '0') : undefined,
                };

                const typeAccommodation = searchParams.get('typeAccomodation') || "hotel";

                const data = await getAccommodationDetails(code, typeAccommodation, params);
                const responseData = data.response.objects;

                console.log("Datos originales:", responseData);
                console.log("isFavorite original:", responseData.isFavorite);

                // Mantén el valor original de isFavorite tal cual viene del servicio
                const detailsWithFavorite = {
                    ...responseData,
                    isFavorite: responseData.isFavorite
                };

                setDetails(detailsWithFavorite);
                setIsFavorite(!!detailsWithFavorite.isFavorite);

                console.log("Datos procesados:", detailsWithFavorite);
                console.log("Es favorito:", detailsWithFavorite.isFavorite);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            loadAccommodationDetails();
        }
    }, [code, searchParams]);

    const animations = [
        "animate-heartBeat",
        "animate-ripple",
        "animate-rotate",
        "animate-confetti",
        "animate-bounce-custom",
        "animate-pulseGlow"
    ];

    const getRandomHeartAnimation = () => {
        const animaciones = animations;
        return animaciones[Math.floor(Math.random() * animaciones.length)];
    };

    // Función para manejar el favorito
    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Verificar si el usuario está logueado
        const token = Cookies.get('token');

        if (!token) {
            // Usuario no está logueado, mostrar notificación
            const notificacion: Notifications = {
                titulo: "Inicio de sesión requerido",
                mensaje: "Debes iniciar sesión para guardar alojamientos en favoritos",
                code: 401,
                tipo: "warning"
            };

            setNotification(notificacion);

            // Ocultar la notificación después de 5 segundos
            setTimeout(() => {
                setNotification(undefined);
            }, 5000);

            return;
        }

        // Continuar con la lógica si el usuario está autenticado
        if (isLoading) return;

        setIsLoading(true);
        setIsAnimating(true);

        setCurrentAnimation(getRandomHeartAnimation());

        try {
            console.log("Details al momento de favorito:", details);

            // Usa accommodationType en lugar de typeAccomodation
            const typeAccomodation = details?.accommodationType || searchParams.get('typeAccomodation');

            if (!details || !typeAccomodation) {
                throw new Error("Información del alojamiento incompleta");
            }

            await toggleFavoriteAccommodation(details.code, typeAccomodation, isFavorite);
            setIsFavorite(!isFavorite);

            setTimeout(() => {
                setIsAnimating(false);
            }, 800);
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

            setTimeout(() => {
                setNotification(undefined);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectRoom = (roomConfigId: number, quantity: number) => {
        setSelectedRooms(prev => ({
            ...prev,
            [roomConfigId]: quantity
        }));
    };

    const handleReserveClick = () => {
        const checkIn = searchParams.get("checkIn") || "";
        const checkOut = searchParams.get("checkOut") || "";
        const params = new URLSearchParams();

        // Añadir parámetros esenciales
        params.set("checkIn", checkIn);
        params.set("checkOut", checkOut);
        params.set("code", details?.code || code); // Añadir el código del alojamiento

        // Añadir el tipo de alojamiento
        if (details?.accommodationType) {
            params.set("type", details.accommodationType);
        }

        // Configurar parámetros según el tipo de alojamiento
        if (details?.accommodationType === "hotel") {
            Object.entries(selectedRooms).forEach(([roomId, qty]) => {
                if (qty > 0) params.append("rooms", `${roomId}:${qty}`);
            });
        } else {
            params.set("apartment", "1");
        }

        router.push(`/${lang}/accommodation/reservation?${params.toString()}`);
    };

    const getAvailabilityStatus = (count: number) => {
        if (count < 5) return { text: `¡Últimas ${count} habitaciones disponibles!`, color: "text-red-500" };
        if (count < 20) return { text: "¡Pocas habitaciones disponibles!", color: "text-yellow-500" };
        return { text: "Disponible", color: "text-green-500" };
    };



    if (loading) return <div className="flex justify-center items-center min-h-screen text-glacier-100">Cargando...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 text-glacier-50">
            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
            {details && (
                <>
                    {/* Estrellas, rating y favorito con mejor visualización responsiva */}
                    <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-glacier-200 mb-2 md:mb-0 mr-3">
                                {details.name}
                            </h1>

                            {/* Botón de favorito */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`text-xl sm:text-2xl focus:outline-none transition-transform ${
                                    isAnimating ? currentAnimation : ''
                                }`}
                                disabled={isLoading}
                            >
                                {isFavorite ? (
                                    <FaHeart className="text-red-500" />
                                ) : (
                                    <FaRegHeart className="text-glacier-300 hover:text-red-400" />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 bg-zinc-800/70 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                            {details.accommodationType !== "apartment" ? (
                                <div className="flex items-center text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FaStar key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < details.stars ? "" : "text-glacier-800 opacity-30"}`} />
                                    ))}
                                </div>
                            ) : null}
                            {details.averageRating && (
                                <>
                                    {/* Mostrar el separador solo si hay estrellas y averageRating */}
                                    {details.accommodationType !== "apartment" && (
                                        <div className="h-4 sm:h-5 w-px bg-glacier-600 mx-1"></div>
                                    )}
                                    {/* Mostrar el rating para ambos tipos de alojamiento */}
                                    <div className="flex items-center text-xs sm:text-sm">
                                        <FaTrophy className="mr-1 text-yellow-400" />
                                        <span className="font-medium text-white">{details.averageRating.toFixed(1)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Collage de imágenes con diseño responsivo */}
                    <div className="grid gap-2 sm:gap-4 grid-cols-12 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[250px] mb-4 sm:mb-8">
                        {details.images && details.images.slice(0, 5).map((img, idx) => {
                            // Define los layouts para diferentes tamaños de pantalla
                            let classes;

                            // Asigna las clases según el índice
                            switch(idx) {
                                case 0:
                                    classes = "col-span-12 row-span-2 sm:col-span-6 sm:row-span-2";
                                    break;
                                case 1:
                                    classes = "col-span-6 row-span-1 sm:col-span-3 sm:row-span-1";
                                    break;
                                case 2:
                                    classes = "col-span-6 row-span-1 sm:col-span-3 sm:row-span-1";
                                    break;
                                case 3:
                                    classes = "col-span-6 row-span-1 sm:col-span-4 sm:row-span-1";
                                    break;
                                case 4:
                                    classes = "col-span-6 row-span-1 sm:col-span-2 sm:row-span-1";
                                    break;
                                default:
                                    classes = "";
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`relative overflow-hidden rounded-lg shadow-md group cursor-pointer ${classes}`}
                                    onClick={() => {
                                        setActiveImageIndex(idx);
                                        setShowGallery(true);
                                    }}
                                >
                                    <Image
                                        src={img}
                                        alt={`${details.name} - Imagen ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {idx === 4 && details.images.length > 5 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <FaImages className="text-2xl sm:text-4xl mx-auto mb-1 sm:mb-2" />
                                                <p className="font-medium text-base sm:text-lg">+{details.images.length - 5} fotos</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3 text-white">
                                        <p className="text-xs sm:text-sm font-medium">{`${details.name} - Vista ${idx + 1}`}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Galería modal con controles adaptados para móvil */}
                    {showGallery && (
                        <div
                            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
                            onClick={() => setShowGallery(false)}
                        >
                            <button
                                className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-xl sm:text-2xl z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowGallery(false);
                                }}
                            >
                                <FaTimes />
                            </button>

                            <div
                                className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={details.images[activeImageIndex]}
                                    alt={`${details.name} - Imagen ${activeImageIndex + 1}`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                />

                                <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center text-white text-sm sm:text-base">
                                    <p>{activeImageIndex + 1} / {details.images.length}</p>
                                </div>

                                <button
                                    className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 sm:p-3 rounded-full text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndex(prev => prev === 0 ? details.images.length - 1 : prev - 1);
                                    }}
                                >
                                    <FaArrowLeft className="text-sm sm:text-base" />
                                </button>

                                <button
                                    className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 sm:p-3 rounded-full text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImageIndex(prev => (prev + 1) % details.images.length);
                                    }}
                                >
                                    <FaArrowRight className="text-sm sm:text-base" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sección de habitaciones disponibles - Ajustada para apartamentos vs hoteles */}
                    <div className="mb-4 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-glacier-200 mb-3 sm:mb-4 border-b-2 border-glacier-500 pb-2">
                            {details.accommodationType === "apartment" ? "Reserva de Apartamento" : "Habitaciones Disponibles"}
                        </h2>

                        {details.availableRooms && details.availableRooms.length > 0 ? (
                            <>
                                {details.accommodationType === "apartment" ? (
                                    // Vista para apartamentos
                                    <div className="bg-zinc-700 rounded-lg p-4 sm:p-6 border border-glacier-700 shadow-md">
                                        <div className="flex flex-col sm:flex-row justify-between">
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-glacier-300">{details.name}</h3>
                                                <p className="text-xs sm:text-sm text-glacier-100 mt-1">
                                                    Capacidad: {Math.max(...details.availableRooms.map(room => room.capacity))} personas
                                                </p>
                                                <p className="text-green-500 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
                                                    Disponible para reserva inmediata
                                                </p>
                                            </div>
                                            <div className="text-right mt-3 sm:mt-0">
                                                <p className="text-base sm:text-lg font-bold text-glacier-200">
                                                    {details.availableRooms[0].price}€ /noche
                                                </p>
                                                <p className="text-xs sm:text-sm text-glacier-400">Impuestos incluidos</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-glacier-800">
                                            <p className="text-sm text-glacier-200 mb-3">
                                                Este apartamento está disponible completo. Selecciona las fechas y reserva ahora.
                                            </p>
                                            <button
                                                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm bg-glacier-500 hover:bg-glacier-600 text-white transition duration-300"
                                                onClick={handleReserveClick}
                                            >
                                                Reservar Apartamento Completo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Vista para hoteles con selección global y botón fuera del carrusel
                                    <>
                                        <div className="bg-glacier-800/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-glacier-100 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                            <div>
                                                <p className="text-xs sm:text-sm">
                                                    <span className="font-medium text-glacier-300">Habitaciones disponibles:</span> {details.availableRooms.length} tipos
                                                </p>
                                                <p className="text-xs mt-1">Desliza horizontalmente para ver todas las opciones</p>
                                            </div>
                                            <div className="text-right text-xs mt-2 sm:mt-0">
                                                <p className="text-glacier-300 font-medium">Selecciona la cantidad y reserva</p>
                                            </div>
                                        </div>

                                        <Swiper
                                            modules={[]}
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            navigation={false}
                                            pagination={false}
                                            breakpoints={{
                                                640: {
                                                    spaceBetween: 15,
                                                    slidesPerView: 1.5,
                                                },
                                                768: {
                                                    spaceBetween: 20,
                                                    slidesPerView: 2,
                                                },
                                                1024: {
                                                    spaceBetween: 20,
                                                    slidesPerView: 2,
                                                },
                                            }}
                                            className="mySwiper"
                                        >
                                            {details.availableRooms.map((room) => {
                                                const availability = getAvailabilityStatus(room.availableCount);
                                                return (
                                                    <SwiperSlide key={room.roomConfigId}>
                                                        <div className="bg-zinc-700 rounded-lg p-3 sm:p-5 border border-glacier-700 shadow-md h-full">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="text-lg sm:text-xl font-semibold text-glacier-300">{room.roomType}</h3>
                                                                    <p className="text-xs sm:text-sm text-glacier-100 mt-1">Capacidad: {room.capacity} personas</p>
                                                                    <p className={`${availability.color} font-medium text-xs sm:text-sm mt-1 sm:mt-2`}>{availability.text}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-base sm:text-lg font-bold text-glacier-200">{room.price}€ /noche</p>
                                                                    <p className="text-xs sm:text-sm text-glacier-400">Impuestos incluidos</p>
                                                                </div>
                                                            </div>

                                                            {/* Selector de cantidad */}
                                                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-glacier-800 flex items-center">
                                                                <label htmlFor={`room-${room.roomConfigId}`} className="text-sm text-glacier-200 mr-2">Cantidad:</label>
                                                                <div className="relative w-full sm:w-auto">
                                                                    <select
                                                                        id={`room-${room.roomConfigId}`}
                                                                        className="appearance-none bg-zinc-600 text-glacier-50 rounded border border-glacier-600 px-3 py-1.5 text-sm w-full sm:w-20 pr-8 focus:outline-none focus:ring-1 focus:ring-glacier-400"
                                                                        value={selectedRooms[room.roomConfigId] || 0}
                                                                        onChange={(e) => handleSelectRoom(room.roomConfigId, parseInt(e.target.value))}
                                                                    >
                                                                        <option value="0">0</option>
                                                                        {[...Array(Math.min(5, room.availableCount))].map((_, i) => (
                                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-glacier-300">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>

                                        {/* Botón global para reservar la selección */}
                                        <button
                                            className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-md text-sm transition duration-300 ${
                                                Object.values(selectedRooms).some((v) => v > 0)
                                                    ? "bg-glacier-500 hover:bg-glacier-600 text-white"
                                                    : "bg-glacier-800 text-glacier-400 cursor-not-allowed"
                                            }`}
                                            disabled={!Object.values(selectedRooms).some((v) => v > 0)}
                                            onClick={handleReserveClick}
                                        >
                                            Reservar selección
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-sm sm:text-base text-glacier-300">No hay disponibilidad en este momento.</p>
                        )}
                    </div>

                    {/* Descripción y Contacto - Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                        <div className="col-span-1 md:col-span-2 bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
                            <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-3 sm:mb-4">Descripción</h2>
                            <p className="text-sm sm:text-base text-glacier-100">{details.description}</p>
                        </div>

                        <div className="bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
                            <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-3 sm:mb-4">Información de contacto</h2>
                            <div className="space-y-2 sm:space-y-3">
                                <p className="text-sm sm:text-base text-glacier-100">
                                    <span className="font-medium text-glacier-300">Dirección:</span> {details.address}, {details.postalCode}
                                </p>
                                <p className="text-sm sm:text-base text-glacier-100">
                                    <span className="font-medium text-glacier-300">Ciudad:</span> {details.cityName}, {details.countryName}
                                </p>
                                <p className="text-sm sm:text-base text-glacier-100">
                                    <span className="font-medium text-glacier-300">Teléfono:</span> {details.phoneNumber}
                                </p>
                                <p className="text-sm sm:text-base text-glacier-100">
                                    <span className="font-medium text-glacier-300">Email:</span> {details.email}
                                </p>
                                {details.website && (
                                    <a
                                        href={details.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 sm:mt-4 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-glacier-600 text-glacier-50 text-sm rounded-md hover:bg-glacier-700 transition duration-300"
                                    >
                                        Visitar sitio web
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección de Amenities */}
                    <div className="col-span-1 md:col-span-2 bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700 mt-4 sm:mt-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-3 sm:mb-4">Servicios y Comodidades</h2>

                        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                            {details.amenities && details.amenities
                                .replace(/"/g, '')
                                .split(',')
                                .map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-1.5 sm:p-2 bg-zinc-600 rounded-md">
                                        <div className="text-base sm:text-lg">
                                            {getAmenityIcon(amenity)}
                                        </div>
                                        <span className="text-xs sm:text-sm text-glacier-100">{amenity}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}