"use client";
import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {getAccommodationDetails, getAvailabilityForRooms} from "../services/accommodationService";
import DatePicker from "react-datepicker";
import {addDays, format, isWithinInterval, parse} from "date-fns";
import {es} from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";
import { AvailabilityResponse } from "@/app/[lang]/accommodation/types/AvailabilityResponse";
import FormularioPago from "../components/PaymentCard"; // Ajusta la ruta si es necesario

enum Step {
    Seleccion = 1,
    Detalles = 2,
    Pago = 3,
}

interface DateRange {
    startDate: string;
    endDate: string;
}
interface Accommodation {
    name: string;
    address: string;
    stars: number;
    cityName: string;
    countryName: string;
    availableRooms?: {
        roomConfigId: string | number;
        roomType: string;
        capacity: number;
        price: number;
    }[];
}

// Ajuste de tipos para la respuesta de disponibilidad
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
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [step, setStep] = useState<Step>(Step.Detalles);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);

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

    useEffect(() => {
        let isActive = true;

        const loadAvailability = async () => {
            if (!accommodationCode) return;

            try {
                setLoading(true);

                let roomConfigIds = '';

                if (isApartment && accommodation?.availableRooms) {
                    roomConfigIds = accommodation.availableRooms
                        .map(room => room.roomConfigId)
                        .join(',');
                } else if (selectedRooms && selectedRooms.length > 0) {
                    roomConfigIds = selectedRooms.map(room => room.roomId).join(',');
                }

                const params = {
                    roomConfigIds: roomConfigIds,
                    accommodationType,
                    code: accommodationCode,
                };

                // Llamada al servicio
                const availabilityData = await getAvailabilityForRooms(params);
                // Usar directamente availabilityData.data como array de fechas
                const fechasDisponibles: string[] = Array.isArray(availabilityData?.data) ? availabilityData.data : [];
                if (fechasDisponibles.length > 0) {
                    const dateRanges = convertDatesToRanges(fechasDisponibles);
                    setAvailableDates(dateRanges);
                } else {
                    setAvailableDates([]);
                }
            } catch (err) {
                console.error("Error al cargar disponibilidad:", err);
                if (isActive) {
                    setError("Error al verificar disponibilidad");
                    setAvailableDates([]);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        const shouldLoadAvailability =
            accommodationCode &&
            ((isApartment && accommodation) ||
                (!isApartment && selectedRooms && selectedRooms.length > 0));

        if (shouldLoadAvailability) {
            loadAvailability();
        }

        return () => {
            isActive = false;
        };
    }, [accommodationCode, isApartment, accommodation, JSON.stringify(selectedRooms)]);

// Función para convertir array de fechas a rangos
    const convertDatesToRanges = (dates: string[]): DateRange[] => {
        if (!dates || dates.length === 0) return [];

        // Ordenar fechas
        const sortedDates = [...dates].sort();
        const ranges: DateRange[] = [];

        let startDate = sortedDates[0];
        let endDate = startDate;

        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = new Date(sortedDates[i]);
            const previousDate = new Date(endDate);
            previousDate.setDate(previousDate.getDate() + 1);

            // Si la fecha actual es consecutiva a la anterior, extender el rango
            if (currentDate.getTime() === previousDate.getTime()) {
                endDate = sortedDates[i];
            } else {
                // Si no es consecutiva, crear un nuevo rango
                ranges.push({ startDate, endDate });
                startDate = sortedDates[i];
                endDate = startDate;
            }
        }

        // Añadir el último rango
        ranges.push({ startDate, endDate });

        return ranges;
    };

    const isDateAvailable = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Verificar si la fecha es anterior a hoy
        if (date < today) {
            return false;
        }

        // Verificar si la fecha es anterior a la fecha de inicio seleccionada
        if (startDate && date < startDate) {
            return false;
        }

        // Verificar si hay fechas disponibles
        if (!availableDates || availableDates.length === 0) {
            return false;
        }

        // Formatear la fecha para comparar en logs
        const formattedDate = format(date, "yyyy-MM-dd");

        // Verificar si la fecha está en algún rango disponible
        return availableDates.some(range => {
            try {
                const rangeStartDate = parse(range.startDate, "yyyy-MM-dd", new Date());
                const rangeEndDate = parse(range.endDate, "yyyy-MM-dd", new Date());

                const result = date >= rangeStartDate && date <= rangeEndDate;

                return result;
            } catch (err) {
                console.error(`Error al parsear fechas para ${formattedDate}:`, err, range);
                return false;
            }
        });
    };

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
        const available = isDateAvailable(date);
        return (
            <div
                className={`font-semibold ${
                    available   ? "text-green-500" : "text-red-500 line-through"
                }`}
            >
                {day}
            </div>
        );
    };
    const nights = startDate && endDate
        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    let total = 0;

    if (isApartment) {
        const totalPricePerNight = accommodation?.availableRooms?.reduce(
            (sum, room) => sum + (room.price || 0), 0
        ) || 0;
        total = totalPricePerNight * nights;
    } else {
        total = selectedRooms.reduce((sum, room) => {
            const roomInfo = accommodation?.availableRooms?.find(
                (r) => r.roomConfigId.toString() === room.roomId
            );
            const price = roomInfo?.price || 0;
            return sum + (room.qty * price);
        }, 0) * nights;
    }
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

    const roomConfigIds: Array<string|number> = isApartment
        ? (accommodation?.availableRooms?.map(r => r.roomConfigId) || [])
        : selectedRooms.map(r => r.roomId);

    // Construir el array de rooms con roomConfigId y qty
    const rooms = isApartment
        ? accommodation?.availableRooms?.map(room => ({
            roomConfigId: room.roomConfigId,
            qty: 1
        })) || []
        : selectedRooms.map(room => ({
            roomConfigId: room.roomId,
            qty: room.qty
        }));

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
                                                    (r) => r.roomId === room.roomId
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
                            {Array.isArray(availability?.data) && availability.data.length > 0 && (
                                <div className="mb-4 bg-zinc-800 rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 text-glacier-200">Disponibilidad</h3>
                                    <div className="space-y-2">
                                        <p className="text-glacier-300">Fechas disponibles:</p>
                                        <ul className="text-sm text-glacier-100 flex flex-wrap gap-2">
                                            {availability.data.map((fecha: string) => (
                                                <li key={fecha} className="bg-glacier-700 px-2 py-1 rounded">{fecha}</li>
                                            ))}
                                        </ul>
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
                                        titulo: "Error",
                                        mensaje: "Por favor, selecciona las fechas de entrada y salida antes de continuar.",
                                        tipo: "error",
                                        code: 403
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
                            {step === Step.Pago && (
                                <div className="bg-zinc-900 rounded-lg p-4 md:p-6 shadow-lg">
                                    <h2 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2">
                                        Completar pago
                                    </h2>
                                    <button
                                        className="bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3 rounded-lg font-medium"
                                        onClick={() => setMostrarFormularioPago(true)}
                                    >
                                        Ir a pago seguro
                                    </button>

                                    {mostrarFormularioPago && (
                                        <FormularioPago
                                            setMostrarFormularioPago={setMostrarFormularioPago}
                                            total={total}
                                            rooms={rooms}
                                            accommodationCode={accommodationCode}
                                            accommodationType={accommodationType}
                                        />
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
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