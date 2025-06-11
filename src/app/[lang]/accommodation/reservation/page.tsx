"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAccommodationDetails, getAvailabilityForRooms } from "../services/accommodationService";
import DatePicker from "react-datepicker";
import { addDays, isWithinInterval, parse, format } from "date-fns";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";

enum Step {
    Seleccion = 1,
    Detalles = 2,
    Pago = 3,
}

interface DateRange {
    startDate: string;
    endDate: string;
}

interface RoomAvailability {
    roomId: string;
    available: boolean;
    availableQuantity: number;
    availableDateRanges: DateRange[];
}

export default function ReservationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const roomsParam = searchParams.getAll("rooms");
    const isApartment = searchParams.get("apartment") === "1";
    const accommodationCode = searchParams.get("code") || "";
    const accommodationType = searchParams.get("type") || "hotel";
    const [notification, setNotification] = useState<Notifications>();

    // Parseo de habitaciones seleccionadas
    const selectedRooms = roomsParam
        .map((r) => {
            const [roomId, qty] = r.split(":");
            return { roomId, qty: Number(qty) };
        })
        .filter((r) => r.qty > 0);

    const [step, setStep] = useState<Step>(Step.Detalles);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Estados para almacenar la información del alojamiento y disponibilidad
    const [accommodation, setAccommodation] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados para manejar las fechas seleccionadas
    const [startDate, setStartDate] = useState<Date | null>(
        checkIn ? parse(checkIn, "yyyy-MM-dd", new Date()) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        checkOut ? parse(checkOut, "yyyy-MM-dd", new Date()) : null
    );
    const [availableDates, setAvailableDates] = useState<DateRange[]>([]);

    // Efecto para cargar los detalles del alojamiento
    useEffect(() => {
        const loadAccommodationDetails = async () => {
            if (!accommodationCode) {
                setError("No se proporcionó código de alojamiento");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const params = {}; // Parámetros adicionales si son necesarios
                const data = await getAccommodationDetails(accommodationCode, accommodationType, params);

                if (data && data.response && data.response.objects) {
                    setAccommodation(data.response.objects);
                    console.log(data.response.objects);
                } else {
                    setError("No se encontraron detalles del alojamiento");
                }
            } catch (err) {
                console.error("Error al cargar detalles del alojamiento:", err);
                setError("Error al cargar el alojamiento");
            } finally {
                setLoading(false);
            }
        };

        loadAccommodationDetails();
    }, [accommodationCode, accommodationType]);

    // Modifica la función de carga de disponibilidad para manejar apartamentos
    useEffect(() => {
        const loadAvailability = async () => {
            if (!accommodationCode) {
                return;
            }

            try {
                // Para apartamentos, verificar disponibilidad de todo el apartamento
                if (isApartment && accommodation) { // Verifica que accommodation exista
                    // Obtener los IDs de todas las habitaciones del apartamento
                    const roomIds = accommodation?.availableRooms?.map(room => room.roomConfigId.toString()) || [];

                    if (roomIds.length > 0) {
                        const availabilityData = await getAvailabilityForRooms(
                            accommodationCode,
                            accommodationType,
                            roomIds,
                            checkIn,
                            checkOut
                        );
                        setAvailability(availabilityData);
                    }
                }
                // Para hoteles, verificar disponibilidad de habitaciones seleccionadas
                else if (selectedRooms.length > 0) {
                    const roomIds = selectedRooms.map(room => room.roomId);
                    const availabilityData = await getAvailabilityForRooms(
                        accommodationCode,
                        accommodationType,
                        roomIds,
                        checkIn,
                        checkOut
                    );
                    setAvailability(availabilityData);
                }
            } catch (err) {
                console.error("Error al cargar disponibilidad:", err);
            }
        };

        // Usamos un temporizador para evitar múltiples llamadas
        const timer = setTimeout(() => {
            loadAvailability();
        }, 500);

        // Limpiamos el temporizador en cada ciclo
        return () => clearTimeout(timer);
    }, [accommodationCode, accommodationType, selectedRooms, checkIn, checkOut, isApartment, accommodation]);

    // Procesar los datos de disponibilidad para obtener los rangos de fechas disponibles
    useEffect(() => {
        if (availability && availability.response && availability.response.objects) {
            const rooms: RoomAvailability[] = availability.response.objects;

            // Extraer todos los rangos de fechas disponibles de todas las habitaciones
            const allRanges: DateRange[] = [];
            rooms.forEach(room => {
                if (room.available && room.availableDateRanges) {
                    room.availableDateRanges.forEach(range => {
                        allRanges.push(range);
                    });
                }
            });

            setAvailableDates(allRanges);
        }
    }, [availability]);

    // Función para verificar si una fecha está disponible
    const isDateAvailable = (date: Date): boolean => {
        // Si ya hay una fecha de entrada seleccionada y estamos eligiendo la fecha de salida,
        // la fecha de salida debe ser posterior a la fecha de entrada
        if (startDate && !endDate && date <= startDate) {
            return false;
        }

        const formattedDate = format(date, "yyyy-MM-dd");
        return availableDates.some(range => {
            const start = parse(range.startDate, "yyyy-MM-dd", new Date());
            const end = parse(range.endDate, "yyyy-MM-dd", new Date());
            return isWithinInterval(date, { start, end });
        });
    };

// Función que se ejecuta cuando cambian las fechas seleccionadas
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;

        // Si la fecha de inicio y fin son iguales, no permitir la selección
        if (start && end && start.getTime() === end.getTime()) {
            // Mantener la fecha de inicio pero eliminar la de fin
            setStartDate(start);
            setEndDate(null);
            return;
        }

        setStartDate(start);
        setEndDate(end);

        // Actualizar parámetros de URL si es necesario
        if (start && end) {
            const formattedStart = format(start, "yyyy-MM-dd");
            const formattedEnd = format(end, "yyyy-MM-dd");

            // Actualizar los parámetros de búsqueda
            const params = new URLSearchParams(searchParams.toString());
            params.set("checkIn", formattedStart);
            params.set("checkOut", formattedEnd);

            // Actualizar la URL sin recargar la página
            const pathname = window.location.pathname;
            const newUrl = `${pathname}?${params.toString()}`;
            window.history.replaceState({}, "", newUrl);
        }
    };

    // Renderizar día personalizado en el calendario
    const renderDayContents = (day: number, date: Date) => {
        const isAvailable = isDateAvailable(date);
        return (
            <div
                className={`font-semibold ${
                    isAvailable ? "text-green-500" : "text-red-500 line-through"
                }`}
            >
                {day}
            </div>
        );
    };

    // Función para manejar el pago
    const handlePayment = async () => {
        if (!startDate || !endDate) {
            alert("Por favor, selecciona las fechas de tu estancia");
            return;
        }

        setPaymentLoading(true);

        try {
            // Aquí iría la lógica para procesar el pago
            // Simular proceso de pago
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPaymentSuccess(true);
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.");
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) {
        return <div className="max-w-2xl mx-auto py-8 px-4 text-center">Cargando información del alojamiento...</div>;
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    className="mt-4 bg-glacier-500 hover:bg-glacier-600 text-white px-4 py-2 rounded"
                    onClick={() => window.history.back()}
                >
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-4 px-4 md:py-8 md:px-8">
            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
            {/* Pasos - Versión responsive */}
            <div className="mb-8 px-2">
                <div className="hidden md:flex justify-between items-center">
                    <StepIndicator label="1. Selección" active={false} completed={true} />
                    <div className="flex-1 h-0.5 bg-glacier-700 mx-2" />
                    <StepIndicator label="2. Detalles" active={step === Step.Detalles} completed={step > Step.Detalles} />
                    <div className="flex-1 h-0.5 bg-glacier-700 mx-2" />
                    <StepIndicator label="3. Pago" active={step === Step.Pago} />
                </div>

                {/* Versión móvil de los pasos */}
                <div className="flex md:hidden justify-between items-center">
                    <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1
                            bg-green-500 text-white border-2 border-glacier-500`}>
                            ✓
                        </div>
                        <span className="text-xs text-glacier-100">1</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-glacier-700 mx-1" />
                    <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1
                            ${step > Step.Detalles ? "bg-green-500 text-white" : "bg-glacier-500 text-white"}
                            border-2 border-glacier-500`}>
                            {step > Step.Detalles ? "✓" : "2"}
                        </div>
                        <span className="text-xs text-glacier-100">2</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-glacier-700 mx-1" />
                    <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1
                            ${step === Step.Pago ? "bg-glacier-500 text-white" : "bg-zinc-700 text-glacier-300"}
                            border-2 border-glacier-500`}>
                            3
                        </div>
                        <span className="text-xs text-glacier-100">3</span>
                    </div>
                </div>
            </div>

            {step === Step.Detalles && (
                <div className="bg-zinc-900 rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2">Detalles de la reserva</h2>

                    {accommodation && (
                        <div className="mb-6 bg-zinc-800 rounded-lg p-4 transition-all hover:shadow-md">
                            <h3 className="font-semibold text-lg mb-2">{accommodation.name}</h3>
                            <p className="text-sm text-glacier-300 mb-2">{accommodation.address}</p>
                            <div className="flex items-center">
                                <div className="flex">
                                    {[...Array(accommodation.stars)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-glacier-300">
                                    {accommodation.cityName}, {accommodation.countryName}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4 bg-zinc-800 rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-glacier-200">Fechas de estancia</h3>
                                <div className="flex justify-center">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleDateChange}
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={new Date()}
                                        selectsRange
                                        inline
                                        locale={es}
                                        monthsShown={1}
                                        renderDayContents={renderDayContents}
                                        filterDate={isDateAvailable}
                                        disabledKeyboardNavigation
                                        className="w-full"
                                    />
                                </div>
                                {startDate && endDate && (
                                    <div className="mt-4 text-center">
                                        <div className="bg-zinc-700 inline-block px-4 py-2 rounded-lg">
                                            <p className="text-glacier-300 text-sm">
                                                <span className="text-white font-medium">Entrada:</span> {format(startDate, "dd/MM/yyyy")}
                                            </p>
                                            <p className="text-glacier-300 text-sm">
                                                <span className="text-white font-medium">Salida:</span> {format(endDate, "dd/MM/yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="mb-4 bg-zinc-800 rounded-lg p-4">
                                {isApartment ? (
                                    <div>
                                        <h3 className="font-semibold mb-2 text-glacier-200">Apartamento completo</h3>
                                        <p className="text-sm">Reservarás el apartamento completo para las fechas seleccionadas.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="font-semibold mb-3 text-glacier-200">Habitaciones seleccionadas</h3>
                                        <ul className="space-y-2">
                                            {selectedRooms.map((room) => {
                                                // Buscar información detallada de la habitación en availability
                                                const roomDetails = availability?.response?.objects?.find(
                                                    (r: RoomAvailability) => r.roomId === room.roomId
                                                );

                                                // Buscar información de tipo de habitación en accommodation.availableRooms
                                                const roomInfo = accommodation?.availableRooms?.find(
                                                    (r) => r.roomConfigId.toString() === room.roomId
                                                );

                                                // Obtener el tipo de habitación o usar un valor predeterminado
                                                const roomType = roomInfo?.roomType || "Estándar";
                                                const capacity = roomInfo?.capacity || 1;

                                                return (
                                                    <li key={room.roomId} className="flex justify-between items-center py-2 px-3 bg-zinc-700 rounded-md">
                                                        <div>
                                                            <span className="font-medium text-white">{roomType}</span>
                                                            <div className="text-xs text-glacier-300 mt-1">
                                                                Capacidad: {capacity} {capacity === 1 ? 'persona' : 'personas'}
                                                            </div>
                                                        </div>
                                                        <div className="bg-glacier-600 text-white px-2 py-1 rounded-full text-sm">
                                                            x{room.qty}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Información de disponibilidad */}
                            {availability && availability.response && availability.response.objects && (
                                <div className="mb-4 bg-zinc-800 rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 text-glacier-200">Disponibilidad</h3>
                                    <div className="space-y-2">
                                        {availability.response.objects.map((room: RoomAvailability) => {
                                            // Buscar información de tipo de habitación
                                            const roomInfo = accommodation?.availableRooms?.find(
                                                (r) => r.roomConfigId.toString() === room.roomId
                                            );
                                            const roomType = roomInfo?.roomType || "Estándar";

                                            return (
                                                <div key={room.roomId} className="p-3 border-b border-zinc-700 last:border-0">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{roomType}:</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.available ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}`}>
                                                            {room.available ? "Disponible" : "No disponible"}
                                                        </span>
                                                    </div>
                                                    {room.available && (
                                                        <p className="text-sm text-glacier-300 mt-1">
                                                            Disponibles: {room.availableQuantity}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            className={`bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${
                                !startDate || !endDate || (startDate && endDate && startDate.getTime() === endDate.getTime())
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={() => {
                                if (!startDate || !endDate) {
                                    setNotification({
                                        title: "Error",
                                        message: "Por favor, selecciona las fechas de entrada y salida antes de continuar.",
                                        type: "error"
                                    });
                                    return;
                                }

                                // Verificar que haya al menos una noche entre las fechas
                                if (startDate.getTime() === endDate.getTime() ||
                                    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) < 1) {
                                    setNotification({
                                        title: "Error",
                                        message: "La fecha de salida debe ser posterior a la fecha de entrada por al menos un día.",
                                        type: "error"
                                    });
                                    return;
                                }

                                // Resto del código de verificación...

                                // Verificar si hay disponibilidad para las fechas seleccionadas
                                const formattedStart = format(startDate, "yyyy-MM-dd");
                                const formattedEnd = format(endDate, "yyyy-MM-dd");

                                // Comprobar disponibilidad en los rangos
                                const hasAvailability = availableDates.some(range => {
                                    const rangeStart = parse(range.startDate, "yyyy-MM-dd", new Date());
                                    const rangeEnd = parse(range.endDate, "yyyy-MM-dd", new Date());

                                    return (
                                        isWithinInterval(startDate, { start: rangeStart, end: rangeEnd }) &&
                                        isWithinInterval(addDays(endDate, -1), { start: rangeStart, end: rangeEnd })
                                    );
                                });

                                if (!hasAvailability) {
                                    setNotification({
                                        title: "Sin disponibilidad",
                                        message: "No hay disponibilidad para el rango de fechas seleccionado. Por favor, selecciona otras fechas.",
                                        type: "error"
                                    });
                                    return;
                                }

                                // Si todo está bien, avanzar al siguiente paso
                                setStep(Step.Pago);
                            }}
                            disabled={!startDate || !endDate || (startDate && endDate && startDate.getTime() === endDate.getTime())}
                        >
                            Continuar a pago
                        </button>
                    </div>
                </div>
            )}

            {step === Step.Pago && (
                <div className="bg-zinc-900 rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2">Completar pago</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-6 bg-zinc-800 rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-glacier-200">Resumen de la reserva</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-glacier-300">Alojamiento:</span>
                                        <span className="font-medium">{accommodation?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-glacier-300">Entrada:</span>
                                        <span>{startDate ? format(startDate, "dd/MM/yyyy") : "-"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-glacier-300">Salida:</span>
                                        <span>{endDate ? format(endDate, "dd/MM/yyyy") : "-"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-700 pb-2">
                                        <span className="text-glacier-300">Tipo:</span>
                                        <span>{isApartment ? "Apartamento completo" : "Habitaciones individuales"}</span>
                                    </div>
                                    {isApartment && (
                                        <div className="flex justify-between pt-2">
                                            <span className="text-glacier-300">Precio total:</span>
                                            <span className="font-bold text-glacier-300">
                                                {(() => {
                                                    // Calcular el número de noches entre las fechas seleccionadas
                                                    const nights = startDate && endDate
                                                        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                                        : 0;

                                                    // Calcular el precio total del apartamento (suma de todas las habitaciones)
                                                    const totalPricePerNight = accommodation?.availableRooms?.reduce(
                                                        (total, room) => total + (room.price || 0), 0
                                                    ) || 0;

                                                    // Multiplicar por el número de noches
                                                    return `${totalPricePerNight * nights}€`;
                                                })()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {!isApartment && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-sm mb-2 text-glacier-200">Habitaciones:</h4>
                                        <ul className="space-y-2">
                                            {selectedRooms.map((room) => {
                                                // Buscar información de tipo de habitación
                                                const roomInfo = accommodation?.availableRooms?.find(
                                                    (r) => r.roomConfigId.toString() === room.roomId
                                                );
                                                const roomType = roomInfo?.roomType || "Estándar";
                                                const price = roomInfo?.price || 0;

                                                return (
                                                    <li key={room.roomId} className="flex justify-between items-center py-2 px-3 bg-zinc-700 rounded-md">
                                                        <div className="flex-1">
                                                            <span className="font-medium">{roomType}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-bold">
                                                                {(() => {
                                                                    // Calcular el número de noches entre las fechas seleccionadas
                                                                    const nights = startDate && endDate
                                                                        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                                                        : 0;

                                                                    // Calcular el precio por habitación multiplicado por noches
                                                                    return `${(room.qty * price * nights)}€`;
                                                                })()}
                                                            </span>
                                                            <div className="text-xs text-glacier-300">
                                                                {startDate && endDate &&
                                                                    `${room.qty * price}€ x ${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} noches`
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        <div className="mt-4 pt-3 border-t border-zinc-700 flex justify-between">
                                            <span className="font-semibold">Total:</span>
                                            <span className="font-bold text-glacier-300">
                                                {(() => {
                                                    // Calcular el número de noches entre las fechas seleccionadas
                                                    const nights = startDate && endDate
                                                        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                                                        : 0;

                                                    // Calcular el total multiplicando por el número de noches
                                                    const total = selectedRooms.reduce((total, room) => {
                                                        const roomInfo = accommodation?.availableRooms?.find(
                                                            (r) => r.roomConfigId.toString() === room.roomId
                                                        );
                                                        const price = roomInfo?.price || 0;
                                                        return total + (room.qty * price);
                                                    }, 0) * nights;

                                                    return `${total}€`;
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            {/* Formulario de pago */}
                            <div className="mb-6 bg-zinc-800 rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-glacier-200">Información de pago</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-glacier-300">Titular de la tarjeta</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-glacier-500"
                                            placeholder="Nombre completo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-glacier-300">Número de tarjeta</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-glacier-500"
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-glacier-300">Fecha expiración</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-glacier-500"
                                                placeholder="MM/AA"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-glacier-300">CVC</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-glacier-500"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                        <button
                            className="order-2 sm:order-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                            onClick={() => setStep(Step.Detalles)}
                            disabled={paymentLoading}
                        >
                            Volver
                        </button>

                        <button
                            className="order-1 sm:order-2 bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                            onClick={handlePayment}
                            disabled={paymentLoading}
                        >
                            {paymentLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : "Completar reserva"}
                        </button>
                    </div>

                    {paymentSuccess && (
                        <div className="mt-6 p-4 bg-green-800 text-green-100 rounded-lg">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">¡Reserva completada con éxito!</h3>
                                <p className="mb-4">Recibirás un email con los detalles de tu reserva en breve.</p>
                                <button
                                    className="mt-2 bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    onClick={() => router.push("/")}
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Estilos CSS para el DatePicker */}
            <style jsx global>{`
                .react-datepicker {
                    font-family: inherit !important;
                    border: none !important;
                    border-radius: 0.5rem !important;
                    background-color: #27272a !important; /* Zinc-800 */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    width: 100%;
                    max-width: 320px;
                    margin: 0 auto;
                }

                .react-datepicker__month-container {
                    width: 100% !important;
                    background-color: #27272a !important; /* Zinc-800 */
                }

                .react-datepicker__header {
                    background-color: #18181b !important; /* Zinc-900 */
                    border-bottom: 1px solid #3f3f46 !important; /* Zinc-700 */
                    padding-top: 0.75rem !important;
                    border-top-left-radius: 0.5rem !important;
                    border-top-right-radius: 0.5rem !important;
                }

                .react-datepicker__current-month {
                    color: #d4d4d8 !important; /* Zinc-300 */
                    font-weight: 600 !important;
                    font-size: 1rem !important;
                    padding-bottom: 0.5rem !important;
                }

                .react-datepicker__day-name {
                    color: #a1a1aa !important; /* Zinc-400 */
                    margin: 0.4rem !important;
                    width: 2rem !important;
                    font-weight: 500 !important;
                }

                .react-datepicker__day {
                    margin: 0.4rem !important;
                    width: 2rem !important;
                    height: 2rem !important;
                    line-height: 2rem !important;
                    border-radius: 9999px !important;
                    color: #d4d4d8 !important; /* Zinc-300 */
                }

                .react-datepicker__day:hover {
                    background-color: #3f3f46 !important; /* Zinc-700 */
                }

                .react-datepicker__day--selected,
                .react-datepicker__day--in-selecting-range,
                .react-datepicker__day--in-range {
                    background-color: #2563eb !important; /* Blue-600 */
                    color: white !important;
                }

                .react-datepicker__day--keyboard-selected {
                    background-color: #3b82f6 !important; /* Blue-500 */
                }

                .react-datepicker__navigation {
                    top: 0.75rem !important;
                }

                /* Botones de navegación */
                .react-datepicker__navigation-icon::before {
                    border-color: #a1a1aa !important; /* Zinc-400 */
                }

                .react-datepicker__navigation:hover *::before {
                    border-color: #d4d4d8 !important; /* Zinc-300 */
                }

                /* Estilos para los días no disponibles */
                .react-datepicker__day--disabled {
                    color: #52525b !important; /* Zinc-600 */
                    text-decoration: line-through;
                }

                @media (max-width: 640px) {
                    .react-datepicker {
                        max-width: 100%;
                    }
                    
                    .react-datepicker__day-name,
                    .react-datepicker__day {
                        margin: 0.2rem !important;
                        width: 1.7rem !important;
                        height: 1.7rem !important;
                        line-height: 1.7rem !important;
                    }
                }
            `}</style>
        </div>
    );
}

function StepIndicator({
                           label,
                           active,
                           completed,
                       }: {
    label: string;
    active?: boolean;
    completed?: boolean;
}) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                ${completed ? "bg-green-500 text-white" : active ? "bg-glacier-500 text-white" : "bg-zinc-700 text-glacier-300"}
                border-2 border-glacier-500`}
            >
                {completed ? "✓" : label[0]}
            </div>
            <span className={`text-xs ${active || completed ? "text-glacier-100" : "text-glacier-400"}`}>{label}</span>
        </div>
    );
}