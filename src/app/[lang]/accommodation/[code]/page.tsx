"use client";
import React, {JSX, useEffect, useState} from "react";
import {useParams, usePathname, useSearchParams} from "next/navigation";
import { getAccommodationDetails } from "@/app/[lang]/accommodation/services/accommodationService";
import Image from "next/image";
import { FaImages, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaWifi, FaStar, FaSwimmingPool, FaDumbbell, FaCoffee, FaTv, FaParking, FaSpa, FaUtensils, FaWind, FaCocktail, FaTrophy } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getAmenityIcon } from "@/app/[lang]/accommodation/utils/amenitiesMap";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    typeAccomodation: string;
    code: string;
    averageRating?: number;
}

export default function AccommodationPage() {
    const { code, lang } = useParams() as { code: string; lang: string };
    const [details, setDetails] = useState<AccommodationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: number }>({});
    const [showGallery, setShowGallery] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const loadAccommodationDetails = async () => {
            try {
                // Extraer parámetros de la URL
                const params = {
                    checkIn: searchParams.get('checkIn') || undefined,
                    checkOut: searchParams.get('checkOut') || undefined,
                    adults: searchParams.has('adults') ? parseInt(searchParams.get('adults') || '0') : undefined,
                    children: searchParams.has('children') ? parseInt(searchParams.get('children') || '0') : undefined,
                    rooms: searchParams.has('rooms') ? parseInt(searchParams.get('rooms') || '0') : undefined,
                };

                console.log("Parámetros extraídos de la URL:", params);

                const typeAccomodation = searchParams.get('typeAccomodation');

                const data = await getAccommodationDetails(code, typeAccomodation, params);
                setDetails(data.response.objects);
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

    const handleSelectRoom = (roomConfigId: number, quantity: number) => {
        setSelectedRooms(prev => ({
            ...prev,
            [roomConfigId]: quantity
        }));
    };

    const handleReserveClick = () => {
        // Aquí irá la lógica para procesar la reserva
        console.log("Habitaciones seleccionadas:", selectedRooms);
        alert("¡Gracias por tu reserva! Te contactaremos pronto para confirmar los detalles.");
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
            {details && (
                <>
                    {/* Estrellas y rating con mejor visualización responsiva */}
                    <div className="flex flex-row justify-between items-start items-center mb-4 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-glacier-200 mb-2 md:mb-0">{details.name}</h1>
                        <div className="flex items-center gap-2 sm:gap-3 bg-zinc-800/70 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                            <div className="flex items-center text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < details.stars ? "" : "text-glacier-800 opacity-30"}`} />
                                ))}
                            </div>
                            {details.averageRating && (
                                <>
                                    <div className="h-4 sm:h-5 w-px bg-glacier-600 mx-1"></div>
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

                    {/* Sección de habitaciones disponibles - Ajustada para móvil */}
                    <div className="mb-4 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-glacier-200 mb-3 sm:mb-4 border-b-2 border-glacier-500 pb-2">Habitaciones Disponibles</h2>

                        {details.availableRooms && details.availableRooms.length > 0 ? (
                            <>
                                {/* Información orientativa para el usuario */}
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

                                                    {/* Selector de cantidad mejorado */}
                                                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-glacier-800 flex flex-col sm:flex-row justify-between items-center">
                                                        <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto">
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

                                                        <button
                                                            className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm transition duration-300 ${
                                                                selectedRooms[room.roomConfigId]
                                                                    ? "bg-glacier-500 hover:bg-glacier-600 text-white"
                                                                    : "bg-glacier-800 text-glacier-400 cursor-not-allowed"
                                                            }`}
                                                            disabled={!selectedRooms[room.roomConfigId]}
                                                            onClick={() => selectedRooms[room.roomConfigId] && handleReserveClick()}
                                                        >
                                                            Reservar ahora
                                                        </button>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </>
                        ) : (
                            <p className="text-sm sm:text-base text-glacier-300">No hay habitaciones disponibles en este momento.</p>
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