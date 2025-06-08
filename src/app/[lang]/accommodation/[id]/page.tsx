"use client";
import React, {JSX, useEffect, useState} from "react";
import {useParams, usePathname, useSearchParams} from "next/navigation";
import { getAccommodationDetails } from "@/app/[lang]/accommodation/services/accommodationService";
import Image from "next/image";
import { FaWifi, FaSwimmingPool, FaDumbbell, FaCoffee, FaTv, FaParking, FaSpa, FaUtensils, FaWind, FaCocktail } from "react-icons/fa";


interface Room {
    availableCount: number;
    capacity: number;
    roomConfigId: number;
    roomType: string;
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
}
const getAmenityIcon = (amenity: string) => {
    const amenityMap: { [key: string]: JSX.Element } = {
        "WiFi": <FaWifi className="text-glacier-300" />,
        "Piscina": <FaSwimmingPool className="text-glacier-300" />,
        "Gimnasio": <FaDumbbell className="text-glacier-300" />,
        "Desayuno incluido": <FaCoffee className="text-glacier-300" />,
        "TV por cable": <FaTv className="text-glacier-300" />,
        "Estacionamiento": <FaParking className="text-glacier-300" />,
        "Spa": <FaSpa className="text-glacier-300" />,
        "Restaurante": <FaUtensils className="text-glacier-300" />,
        "Aire acondicionado": <FaWind className="text-glacier-300" />,
        "Bar": <FaCocktail className="text-glacier-300" />
    };

    return amenityMap[amenity] || null;
};

export default function AccommodationPage() {
    const { id, lang } = useParams() as { id: string; lang: string };
    const [details, setDetails] = useState<AccommodationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: number }>({});

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

                // Llamar a getAccommodationDetails con los parámetros
                const data = await getAccommodationDetails(id, params);
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

        if (id) {
            loadAccommodationDetails();
        }
    }, [id, searchParams]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-zinc-800 text-glacier-50">
            {details && (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <h1 className="text-3xl font-bold text-glacier-200 mb-2 md:mb-0">{details.name}</h1>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-2xl ${i < details.stars ? "text-glacier-400" : "text-glacier-800"}`}>★</span>
                            ))}
                        </div>
                    </div>

                    {/* Collage de imágenes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 rounded-lg overflow-hidden">
                        {details.images && details.images.map((img, index) => (
                            <div key={index} className="relative h-64 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] shadow-md">
                                <Image
                                    src={img}
                                    alt={`${details.name} - Imagen ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Sección de habitaciones disponibles */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-glacier-200 mb-4 border-b-2 border-glacier-500 pb-2">Habitaciones Disponibles</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {details.availableRooms && details.availableRooms.map((room) => {
                                const availability = getAvailabilityStatus(room.availableCount);
                                return (
                                    <div key={room.roomConfigId} className="bg-zinc-700 rounded-lg p-5 border border-glacier-700 shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-glacier-300">{room.roomType}</h3>
                                                <p className="text-glacier-100 mt-1">Capacidad: {room.capacity} personas</p>
                                                <p className={`${availability.color} font-medium text-sm mt-2`}>{availability.text}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-glacier-200 text-lg font-bold">Desde 85€ /noche</p>
                                                <p className="text-glacier-400 text-sm">Impuestos incluidos</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-glacier-800 flex flex-col sm:flex-row justify-between items-center">
                                            <div className="flex items-center mb-3 sm:mb-0">
                                                <label htmlFor={`room-${room.roomConfigId}`} className="text-glacier-200 mr-2">Cantidad:</label>
                                                <select
                                                    id={`room-${room.roomConfigId}`}
                                                    className="bg-zinc-600 text-glacier-50 rounded border border-glacier-600 px-2 py-1"
                                                    value={selectedRooms[room.roomConfigId] || 0}
                                                    onChange={(e) => handleSelectRoom(room.roomConfigId, parseInt(e.target.value))}
                                                >
                                                    <option value="0">0</option>
                                                    {[...Array(Math.min(5, room.availableCount))].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                className={`px-4 py-2 rounded-md transition duration-300 ${
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
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-2 bg-zinc-700 rounded-lg shadow-md p-6 border border-glacier-700">
                            <h2 className="text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-4">Descripción</h2>
                            <p className="text-glacier-100">{details.description}</p>
                        </div>

                        <div className="bg-zinc-700 rounded-lg shadow-md p-6 border border-glacier-700">
                            <h2 className="text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-4">Información de contacto</h2>
                            <div className="space-y-3">
                                <p className="text-glacier-100">
                                    <span className="font-medium text-glacier-300">Dirección:</span> {details.address}, {details.postalCode}
                                </p>
                                <p className="text-glacier-100">
                                    <span className="font-medium text-glacier-300">Ciudad:</span> {details.cityName}, {details.countryName}
                                </p>
                                <p className="text-glacier-100">
                                    <span className="font-medium text-glacier-300">Teléfono:</span> {details.phoneNumber}
                                </p>
                                <p className="text-glacier-100">
                                    <span className="font-medium text-glacier-300">Email:</span> {details.email}
                                </p>
                                {details.website && (
                                    <a
                                        href={details.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block px-4 py-2 bg-glacier-600 text-glacier-50 rounded-md hover:bg-glacier-700 transition duration-300"
                                    >
                                        Visitar sitio web
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Sección de Amenities */}
                    <div className="col-span-2 bg-zinc-700 rounded-lg shadow-md p-6 border border-glacier-700 mt-8">
                        <h2 className="text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-4">Servicios y Comodidades</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {details.amenities && details.amenities
                                .replace(/"/g, '')
                                .split(',')
                                .map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-2 bg-zinc-600 rounded-md">
                                        <div className="text-lg">
                                            {getAmenityIcon(amenity)}
                                        </div>
                                        <span className="text-glacier-100">{amenity}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}