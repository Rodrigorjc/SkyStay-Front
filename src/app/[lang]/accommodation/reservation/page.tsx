"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAccommodationDetails, getAvailabilityForRooms } from "../services/accommodationService";
import DatePicker from "react-datepicker";
import { addDays, format, isWithinInterval, parse } from "date-fns";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";
import { AvailabilityResponse } from "@/app/[lang]/accommodation/types/AvailabilityResponse";
import FormularioPago from "../components/PaymentCard";
import { useDictionary } from "@context";
import Loader from "@/app/components/ui/Loader";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar, FaBed, FaUsers, FaCheckCircle, FaTimesCircle, FaEuroSign, FaChevronDown } from "react-icons/fa";

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

export default function ReservationPage() {
    const { dict } = useDictionary();
    const router = useRouter();
    const searchParams = useSearchParams();
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const roomsParam = searchParams.getAll("rooms");
    const isApartment = searchParams.get("apartment") === "1";
    const code = searchParams.get("code") || "";
    const type = searchParams.get("type") || "hotel";
    const [notification, setNotification] = useState<Notifications>();

    const selectedRooms = roomsParam
        .map((r) => {
            const [roomId, qty] = r.split(":");
            return { roomId, qty: Number(qty) };
        })
        .filter((r) => r.qty > 0);

    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [step, setStep] = useState<Step>(Step.Detalles);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(
        checkIn ? parse(checkIn, "yyyy-MM-dd", new Date()) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        checkOut ? parse(checkOut, "yyyy-MM-dd", new Date()) : null
    );
    const [availableDates, setAvailableDates] = useState<DateRange[]>([]);
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    // Cargar detalles
    useEffect(() => {
        const loadDetails = async () => {
            if (!code) {
                setError(dict.CLIENT.RESERVATION.ERROR.NO_CODE);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await getAccommodationDetails(code, type, {});
                if (res?.response?.objects) setAccommodation(res.response.objects);
                else setError(dict.CLIENT.RESERVATION.ERROR.NO_DETAILS);
            } catch {
                setError(dict.CLIENT.RESERVATION.ERROR.LOAD);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [code, type]);

    // Cargar disponibilidad
    useEffect(() => {
        let active = true;
        const loadAvail = async () => {
            if (!code) return;
            try {
                setLoading(true);
                let ids = '';
                if (isApartment && accommodation?.availableRooms)
                    ids = accommodation.availableRooms.map(r => r.roomConfigId).join(',');
                else
                    ids = selectedRooms.map(r => r.roomId).join(',');
                const params = { roomConfigIds: ids, accommodationType: type, code };
                const data = await getAvailabilityForRooms(params);
                const dates: string[] = Array.isArray(data?.data) ? data.data : [];
                setAvailableDates(convertRanges(dates));
            } catch {
                if (active) setError(dict.CLIENT.RESERVATION.ERROR.AVAILABILITY);
                setAvailableDates([]);
            } finally {
                if (active) setLoading(false);
            }
        };
        const should = code && ((isApartment && accommodation) || (!isApartment && selectedRooms.length));
        if (should) loadAvail();
        return () => { active = false; };
    }, [code, type, isApartment, accommodation, JSON.stringify(selectedRooms)]);

    const convertRanges = (dates: string[]): DateRange[] => {
        if (!dates.length) return [];
        const sorted = [...dates].sort();
        const ranges: DateRange[] = [];
        let start = sorted[0], end = start;
        for (let i = 1; i < sorted.length; i++) {
            const cur = new Date(sorted[i]);
            const prev = new Date(end); prev.setDate(prev.getDate() + 1);
            if (cur.getTime() === prev.getTime()) end = sorted[i];
            else { ranges.push({ startDate: start, endDate: end }); start = sorted[i]; end = start; }
        }
        ranges.push({ startDate: start, endDate: end });
        return ranges;
    };

    const isDateAvailable = (date: Date) => {
        const today = new Date(); 
        today.setHours(0, 0, 0, 0);
        
        // No permitir fechas pasadas
        if (date < today) return false;
        
        // Si no hay fechas disponibles, no permitir nada
        if (!availableDates.length) return false;
        
        return availableDates.some(r => {
            const s = parse(r.startDate, "yyyy-MM-dd", new Date());
            const e = parse(r.endDate, "yyyy-MM-dd", new Date());
            return date >= s && date <= e;
        });
    };

    // Nueva función específica para validar checkout
    const isCheckoutDateValid = (checkinDate: Date, checkoutDate: Date) => {
        if (!checkinDate || !checkoutDate) return false;
        
        // Para estancias de una noche, solo necesitamos que el checkin esté disponible
        const oneDay = 24 * 60 * 60 * 1000;
        const isOneNight = (checkoutDate.getTime() - checkinDate.getTime()) === oneDay;
        
        if (isOneNight) {
            // Para una noche, solo verificar que el día de entrada esté disponible
            return isDateAvailable(checkinDate);
        }
        
        // Para múltiples noches, verificar todo el rango
        return isRangeAvailable(checkinDate, checkoutDate);
    };

    const isRangeAvailable = (start: Date, end: Date) => {
        if (!start || !end) return false;
        
        // Crear array con todas las fechas del rango seleccionado
        const datesInRange = [];
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
            datesInRange.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Verificar que TODAS las fechas del rango estén disponibles
        return datesInRange.every(date => isDateAvailable(date));
    };

    const filterDate = (date: Date) => {
        // Siempre permitir fechas disponibles para checkin
        if (!isDateAvailable(date)) return false;
        
        // Si ya hay fecha de inicio, aplicar lógica especial
        if (startDate && !endDate) {
            const nextDay = new Date(startDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            // Permitir el día siguiente para checkout (una noche)
            if (date.getTime() === nextDay.getTime()) {
                return true;
            }
            
            // Para rangos más largos, verificar continuidad desde el día después del checkin
            if (date > nextDay) {
                // Crear un array de fechas desde el día después del checkin hasta la fecha seleccionada
                const datesInRange = [];
                const currentDate = new Date(nextDay);
                
                while (currentDate < date) {
                    datesInRange.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                // Verificar que todas las fechas intermedias estén disponibles
                return datesInRange.every(d => isDateAvailable(d));
            }
        }
        
        return true;
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [s, e] = dates;
        
        // Si se hace clic en la misma fecha que ya está seleccionada como inicio
        if (s && startDate && s.getTime() === startDate.getTime() && !e) {
            // Establecer checkout para el día siguiente (una noche)
            const nextDay = new Date(s);
            nextDay.setDate(nextDay.getDate() + 1);
            
            // Para una noche, solo verificar que el día de entrada esté disponible
            if (!isDateAvailable(s)) {
                setNotification({
                    titulo: "Error de disponibilidad",
                    mensaje: "La fecha seleccionada no está disponible.",
                    tipo: "error",
                    code: 400,
                });
                return;
            }
            
            setStartDate(s);
            setEndDate(nextDay);
            
            // Actualizar URL
            const ps = new URLSearchParams(searchParams.toString());
            ps.set("checkIn", format(s, "yyyy-MM-dd"));
            ps.set("checkOut", format(nextDay, "yyyy-MM-dd"));
            window.history.replaceState({}, "", `${window.location.pathname}?${ps}`);
            return;
        }
        
        // Primer clic - establecer fecha de inicio
        if (s && !e) {
            setStartDate(s);
            setEndDate(null);
            return;
        }
        
        // Selección de rango completo
        if (s && e) {
            // Si las fechas son iguales (doble clic rápido), establecer una noche
            if (s.getTime() === e.getTime()) {
                const nextDay = new Date(s);
                nextDay.setDate(nextDay.getDate() + 1);
                
                // Para una noche, solo verificar que el día de entrada esté disponible
                if (!isDateAvailable(s)) {
                    setNotification({
                        titulo: "Error de disponibilidad",
                        mensaje: "La fecha seleccionada no está disponible.",
                        tipo: "error",
                        code: 400,
                    });
                    setStartDate(s);
                    setEndDate(null);
                    return;
                }
                
                setStartDate(s);
                setEndDate(nextDay);
                
                // Actualizar URL
                const ps = new URLSearchParams(searchParams.toString());
                ps.set("checkIn", format(s, "yyyy-MM-dd"));
                ps.set("checkOut", format(nextDay, "yyyy-MM-dd"));
                window.history.replaceState({}, "", `${window.location.pathname}?${ps}`);
                return;
            }
            
            // Validar rango completo para múltiples días
            if (!isRangeAvailable(s, e)) {
                setNotification({
                    titulo: "Error de disponibilidad",
                    mensaje: "El rango seleccionado contiene días no disponibles. Por favor, selecciona un período completamente disponible.",
                    tipo: "error",
                    code: 400,
                });
                setStartDate(s);
                setEndDate(null);
                return;
            }
            
            setStartDate(s);
            setEndDate(e);
            
            // Actualizar URL
            const ps = new URLSearchParams(searchParams.toString());
            ps.set("checkIn", format(s, "yyyy-MM-dd"));
            ps.set("checkOut", format(e, "yyyy-MM-dd"));
            window.history.replaceState({}, "", `${window.location.pathname}?${ps}`);
        } else {
            setStartDate(s);
            setEndDate(e);
        }
    };

    if (error)
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="bg-zinc-700 rounded-xl p-8 border border-glacier-700 shadow-2xl max-w-md mx-auto">
                    <div className="text-center">
                        <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-glacier-50 mb-4">Error</h2>
                        <p className="text-red-400 mb-6">{error}</p>
                        <button
                            className="px-6 py-3 bg-glacier-600 hover:bg-glacier-700 text-white rounded-lg transition-colors font-medium"
                            onClick={() => router.back()}
                        >
                            {dict.CLIENT.RESERVATION.BUTTON.BACK}
                        </button>
                    </div>
                </div>
            </div>
        );

    const nights = startDate && endDate
        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : startDate ? 1 : 0; // Si solo hay fecha de inicio, asumir una noche
    const total = nights * (
        isApartment
            ? accommodation?.availableRooms?.reduce((sum, r) => sum + r.price, 0)!
            : selectedRooms.reduce(
                (sum, room) =>
                    sum +
                    (accommodation?.availableRooms?.find(
                        (r) => r.roomConfigId.toString() === room.roomId
                    )?.price || 0) * room.qty,
                0
            )
    );

    if (!dict || Object.keys(dict).length === 0) {
        return null;
    }
    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );

    return (
        <div className="min-h-screen  text-glacier-50">
            <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
                {notification && (
                    <NotificationComponent
                        Notifications={notification}
                        onClose={() => setNotification(undefined)}
                    />
                )}

                {/* Header responsive */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-glacier-200 mb-2">
                        {dict.CLIENT.RESERVATION.TITLE || "Reservar Alojamiento"}
                    </h1>
                    <p className="text-sm sm:text-base text-glacier-300">
                        {dict.CLIENT.RESERVATION.SUBTITLE || "Completa tu reserva paso a paso"}
                    </p>
                </div>

                {/* Pasos responsive */}
                <div className="mb-6 sm:mb-10">
                    <Steps step={step} dict={dict.CLIENT.RESERVATION.STEPS} />
                </div>

                {/* Detalles */}
                {step === Step.Detalles && (
                    <div className="bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <FaCalendarAlt className="text-glacier-400 text-lg sm:text-xl mr-2 sm:mr-3" />
                            <h2 className="text-xl sm:text-2xl font-bold text-glacier-200 border-b-2 border-glacier-500 pb-2">
                                {dict.CLIENT.RESERVATION.TITLES.DETAILS}
                            </h2>
                        </div>

                        {/* Información del alojamiento */}
                        {accommodation && (
                            <div className="mb-6 sm:mb-8 bg-zinc-600 p-4 sm:p-6 rounded-lg border border-glacier-700">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-glacier-200">
                                            {accommodation.name}
                                        </h3>
                                        <div className="flex items-center mb-2 text-glacier-300">
                                            <FaMapMarkerAlt className="text-glacier-400 mr-2 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm break-words">{accommodation.address}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center">
                                                {[...Array(accommodation.stars)].map((_, i) => (
                                                    <FaStar key={i} className="text-yellow-400 text-sm mr-1" />
                                                ))}
                                                <span className="ml-2 text-xs sm:text-sm text-glacier-300">
                                                    {accommodation.cityName}, {accommodation.countryName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                            {/* Calendario */}
                            <div className="col-span-1 md:col-span-2 bg-zinc-600 p-4 sm:p-6 rounded-lg border border-glacier-700 shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="text-glacier-400 mr-2 sm:mr-3" />
                                        <h3 className="font-semibold text-base sm:text-lg text-glacier-200 border-b-2 border-glacier-500 pb-2">
                                            {dict.CLIENT.RESERVATION.LABELS.DATES}
                                        </h3>
                                    </div>
                                    {/* Botón toggle para móvil */}
                                    <button
                                        className="md:hidden text-glacier-400 hover:text-glacier-200 transition-colors"
                                        onClick={() => setShowCalendar(!showCalendar)}
                                    >
                                        <FaChevronDown className={`transform transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {/* Resumen de fechas móvil */}
                                {startDate && endDate && (
                                    <div className="md:hidden mb-4 bg-zinc-700 rounded-lg p-3 border border-glacier-700">
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="text-center">
                                                <div className="text-glacier-400 mb-1">
                                                    {dict.CLIENT.RESERVATION.LABELS.CHECKIN}
                                                </div>
                                                <div className="font-semibold text-glacier-100">
                                                    {format(startDate, "dd/MM/yyyy")}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-glacier-400 mb-1">
                                                    {dict.CLIENT.RESERVATION.LABELS.CHECKOUT}
                                                </div>
                                                <div className="font-semibold text-glacier-100">
                                                    {format(endDate, "dd/MM/yyyy")}
                                                </div>
                                            </div>
                                        </div>
                                        {nights > 0 && (
                                            <div className="text-center mt-2 pt-2 border-t border-glacier-700">
                                                <span className="text-glacier-300 text-xs">
                                                    {nights} {nights === 1 ? 'noche' : 'noches'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Leyenda */}
                                <div className={`mb-4 flex flex-wrap gap-2 sm:gap-4 text-xs ${!showCalendar ? 'md:flex' : ''}`}>
                                    <div className="flex items-center">
                                        <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                                        <span className="text-glacier-300">Disponible</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full mr-1 sm:mr-2"></div>
                                        <span className="text-glacier-300">No disponible</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 sm:w-3 h-2 sm:h-3 bg-glacier-500 rounded-full mr-1 sm:mr-2"></div>
                                        <span className="text-glacier-300">Seleccionado</span>
                                    </div>
                                </div>

                                {/* Calendario colapsable */}
                                <div className={`calendar-container ${showCalendar ? 'block' : 'hidden md:block'}`}>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleDateChange}
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={new Date()}
                                        selectsRange
                                        inline
                                        locale={es}
                                        renderDayContents={(day, date) => {
                                            const isAvailable = isDateAvailable(date);
                                            const isSelected = (startDate && date.toDateString() === startDate.toDateString()) ||
                                                             (endDate && date.toDateString() === endDate.toDateString());
                                            const isInRange = startDate && endDate && 
                                                            date > startDate && date < endDate;
                                            

                                            // Verificar si la fecha está en un rango válido cuando hay fecha de inicio
                                            const isValidForRange = !startDate || !endDate || isRangeAvailable(startDate, date);
                                            
                                            return (
                                                <span className={`
                                                    relative inline-flex items-center justify-center w-full h-full font-medium text-xs sm:text-sm
                                                    transition-all duration-200
                                                    ${isSelected 
                                                        ? 'bg-glacier-500 text-white shadow-lg ring-2 ring-glacier-300 rounded-lg' 
                                                        : isInRange && isValidForRange
                                                        ? 'bg-glacier-200 text-glacier-800 rounded-lg'
                                                        : isAvailable && isValidForRange
                                                        ? 'text-green-400 hover:bg-green-500/20 hover:text-green-300 rounded-lg' 
                                                        : 'text-red-400 cursor-not-allowed hover:bg-red-500/20 rounded-lg'
                                                    }
                                                    ${!isAvailable || !isValidForRange ? 'unavailable-day' : ''}
                                                `}>
                                                    {day}
                                                </span>
                                            );
                                        }}
                                        filterDate={filterDate}
                                        disabledKeyboardNavigation
                                    />
                                </div>

                                {/* Resumen de fechas desktop */}
                                {startDate && (
                                    <div className="hidden md:block mt-6 bg-zinc-700 rounded-lg p-4 border border-glacier-700">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-center">
                                                <div className="text-glacier-400 mb-1">
                                                    {dict.CLIENT.RESERVATION.LABELS.CHECKIN}
                                                </div>
                                                <div className="font-semibold text-glacier-100">
                                                    {format(startDate, "dd/MM/yyyy")}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-glacier-400 mb-1">
                                                    {dict.CLIENT.RESERVATION.LABELS.CHECKOUT}
                                                </div>
                                                <div className="font-semibold text-glacier-100">
                                                    {endDate ? format(endDate, "dd/MM/yyyy") : "Por seleccionar"}
                                                </div>
                                            </div>
                                        </div>
                                        {nights > 0 && (
                                            <div className="text-center mt-3 pt-3 border-t border-glacier-700">
                                                <span className="text-glacier-300 text-sm">
                                                    {nights} {nights === 1 ? 'noche' : 'noches'}
                                                </span>
                                            </div>
                                        )}
                                        {startDate && !endDate && (
                                            <div className="text-center mt-3 pt-3 border-t border-glacier-700">
                                                <span className="text-glacier-400 text-xs">
                                                    Haz clic de nuevo en la misma fecha para reservar una sola noche
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Habitaciones y disponibilidad */}
                            <div className="space-y-4 sm:space-y-6">
                                <div className="bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
                                    <div className="flex items-center mb-4">
                                        <FaBed className="text-glacier-400 mr-2 sm:mr-3" />
                                        <h3 className="font-semibold text-base sm:text-lg text-glacier-200 border-b-2 border-glacier-500 pb-2">
                                            {isApartment ? dict.CLIENT.RESERVATION.LABELS.APARTMENT : dict.CLIENT.RESERVATION.LABELS.ROOMS}
                                        </h3>
                                    </div>

                                    {isApartment ? (
                                        <div className="bg-zinc-600 rounded-lg p-3 sm:p-4 border border-glacier-700">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="mb-2 sm:mb-0">
                                                    <h4 className="font-medium text-glacier-100 text-sm sm:text-base">
                                                        {dict.CLIENT.RESERVATION.LABELS.APARTMENT}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-glacier-300 mt-1">
                                                        {dict.CLIENT.RESERVATION.MSG.APARTMENT_FULL}
                                                    </p>
                                                </div>
                                                <div className="bg-glacier-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                                                    1x
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedRooms.map((room) => {
                                                const info = accommodation?.availableRooms?.find(
                                                    (r) => r.roomConfigId.toString() === room.roomId
                                                );
                                                const typeLabel = info?.roomType || dict.CLIENT.RESERVATION.DEFAULT.ROOM_TYPE;
                                                const cap = info?.capacity || 1;
                                                const price = info?.price || 0;
                                                return (
                                                    <div
                                                        key={room.roomId}
                                                        className="bg-zinc-600 rounded-lg p-3 sm:p-4 border border-glacier-700"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                            <div className="flex-1 mb-2 sm:mb-0">
                                                                <h4 className="font-medium text-glacier-100 mb-1 sm:mb-2 text-sm sm:text-base">
                                                                    {typeLabel}
                                                                </h4>
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-glacier-300">
                                                                    <div className="flex items-center">
                                                                        <FaUsers className="mr-1" />
                                                                        <span>{dict.CLIENT.RESERVATION.MSG.CAPACITY} {cap}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <FaEuroSign className="mr-1" />
                                                                        <span>{price}€ / noche</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="bg-glacier-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                                                                x{room.qty}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Disponibilidad */}
                                {availableDates.length > 0 && (
                                    <div className="bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
                                        <div className="flex items-center mb-4">
                                            <FaCheckCircle className="text-green-400 mr-2 sm:mr-3" />
                                            <h3 className="font-semibold text-base sm:text-lg text-glacier-200 border-b-2 border-glacier-500 pb-2">
                                                {dict.CLIENT.RESERVATION.LABELS.AVAILABILITY}
                                            </h3>
                                        </div>
                                        <div className="grid gap-2">
                                            {availableDates.slice(0, 3).map((range, index) => (
                                                <div key={range.startDate} 
                                                     className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 sm:p-3">
                                                    <div className="text-xs sm:text-sm text-green-400 font-medium">
                                                        {format(parse(range.startDate, "yyyy-MM-dd", new Date()), "dd/MM")} 
                                                        {" → "} 
                                                        {format(parse(range.endDate, "yyyy-MM-dd", new Date()), "dd/MM")}
                                                    </div>
                                                </div>
                                            ))}
                                            {availableDates.length > 3 && (
                                                <div className="text-center text-glacier-400 text-xs sm:text-sm mt-2">
                                                    +{availableDates.length - 3} periodos más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón continuar */}
                        <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
                            <button
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-md font-medium bg-glacier-500 hover:bg-glacier-600 text-white transition-colors text-sm sm:text-base"
                                onClick={() => {
                                    if (!startDate) {
                                        setNotification({
                                            titulo: dict.CLIENT.RESERVATION.ERROR.TITLE,
                                            mensaje: "Por favor selecciona al menos la fecha de entrada.",
                                            tipo: "error",
                                            code: 400,
                                        });
                                        return;
                                    }
                                    
                                    // Si no hay fecha de salida, establecer para el día siguiente (una noche)
                                    let checkoutDate = endDate;
                                    if (!checkoutDate) {
                                        checkoutDate = new Date(startDate);
                                        checkoutDate.setDate(checkoutDate.getDate() + 1);
                                        setEndDate(checkoutDate);
                                    }
                                    
                                    // Usar la nueva función de validación
                                    if (!isCheckoutDateValid(startDate, checkoutDate)) {
                                        setNotification({
                                            titulo: dict.CLIENT.RESERVATION.ERROR.TITLE,
                                            mensaje: "Las fechas seleccionadas no están disponibles.",
                                            tipo: "error",
                                            code: 400,
                                        });
                                        return;
                                    }
                                    
                                    setStep(Step.Pago);
                                }}
                            >
                                {dict.CLIENT.RESERVATION.BUTTON.CONTINUE}
                            </button>
                        </div>
                    </div>
                )}

                {/* Pago */}
                {step === Step.Pago && (
                    <div className="bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <FaEuroSign className="text-glacier-400 text-lg sm:text-xl mr-2 sm:mr-3" />
                            <h2 className="text-xl sm:text-2xl font-bold text-glacier-200 border-b-2 border-glacier-500 pb-2">
                                {dict.CLIENT.RESERVATION.TITLES.PAY}
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                            {/* Resumen */}
                            <div className="bg-zinc-600 rounded-lg p-4 sm:p-6 border border-glacier-700 shadow-md">
                                <h3 className="font-semibold text-base sm:text-xl mb-4 sm:mb-6 text-glacier-200 border-b-2 border-glacier-500 pb-3">
                                    {dict.CLIENT.RESERVATION.LABELS.SUMMARY}
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-start py-2 border-b border-glacier-700">
                                        <span className="text-xs sm:text-lg text-glacier-300 font-medium">
                                            {dict.CLIENT.RESERVATION.LABELS.ACCOMMODATION}:
                                        </span>
                                        <span className="font-medium text-xs sm:text-lg text-glacier-100 text-right ml-2">
                                            {accommodation?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-glacier-700">
                                        <span className="text-xs sm:text-lg text-glacier-300 font-medium">
                                            {dict.CLIENT.RESERVATION.LABELS.CHECKIN}:
                                        </span>
                                        <span className="font-medium text-xs sm:text-lg text-glacier-100">
                                            {startDate ? format(startDate, "dd/MM/yyyy") : "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-glacier-700">
                                        <span className="text-xs sm:text-lg text-glacier-300 font-medium">
                                            {dict.CLIENT.RESERVATION.LABELS.CHECKOUT}:
                                        </span>
                                        <span className="font-medium text-xs sm:text-lg text-glacier-100">
                                            {endDate ? format(endDate, "dd/MM/yyyy") : "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 text-base sm:text-xl">
                                        <span className="font-bold text-glacier-200">
                                            {dict.CLIENT.RESERVATION.LABELS.TOTAL}:
                                        </span>
                                        <span className="font-bold text-2xl sm:text-2xl text-glacier-100">
                                            {total}€
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario de pago */}
                            <div className="flex flex-col justify-center items-center space-y-4 sm:space-y-6">
                                {!showPaymentForm ? (
                                    <button
                                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium bg-green-600 hover:bg-green-700 text-white transition-colors text-sm sm:text-lg"
                                        onClick={() => setShowPaymentForm(true)}
                                    >
                                        {dict.CLIENT.RESERVATION.BUTTON.PAY}
                                    </button>
                                ) : (
                                    <div className="w-full">
                                        <FormularioPago
                                            total={total}
                                            rooms={selectedRooms.map(room => ({
                                                roomConfigId: room.roomId,
                                                qty: room.qty
                                            }))}
                                            accommodationCode={code}
                                            accommodationType={type}
                                            setMostrarFormularioPago={setShowPaymentForm}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Estilos CSS consistentes */}
            <style jsx global>{`
                .calendar-container .react-datepicker {
                    background-color: #52525b;
                    border: 1px solid #6b7280;
                    border-radius: 8px;
                    color: #f9fafb;
                    font-family: inherit;
                    width: 100%;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker {
                        font-size: 12px;
                    }
                }

                .calendar-container .react-datepicker__header {
                    background-color: #374151;
                    border-bottom: 1px solid #6b7280;
                    border-radius: 8px 8px 0 0;
                    padding: 0.75rem 1rem;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__header {
                        padding: 0.5rem;
                    }
                }

                .calendar-container .react-datepicker__current-month {
                    color: #f9fafb;
                    font-weight: 600;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__current-month {
                        font-size: 0.9rem;
                        margin-bottom: 0.25rem;
                    }
                }

                .calendar-container .react-datepicker__day-names {
                    margin-bottom: 0.5rem;
                }

                .calendar-container .react-datepicker__day-name {
                    color: #d1d5db;
                    font-weight: 500;
                    width: 2.5rem;
                    line-height: 2rem;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__day-name {
                        width: 2rem;
                        line-height: 1.5rem;
                        font-size: 0.75rem;
                    }
                }

                .calendar-container .react-datepicker__month {
                    margin: 0.75rem;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__month {
                        margin: 0.5rem;
                    }
                }

                .calendar-container .react-datepicker__day {
                    width: 2.5rem;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin: 0.2rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__day {
                        width: 2rem;
                        height: 2rem;
                        line-height: 2rem;
                        margin: 0.1rem;
                        border-radius: 6px;
                    }
                }

                .calendar-container .react-datepicker__day:hover {
                    background-color: transparent !important;
                    border-radius: 8px;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__day:hover {
                        border-radius: 6px;
                    }
                }

                .calendar-container .react-datepicker__navigation {
                    top: 1rem;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__navigation {
                        top: 0.75rem;
                    }
                }

                .calendar-container .react-datepicker__navigation--previous {
                    left: 1rem;
                    border-right-color: #9ca3af;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__navigation--previous {
                        left: 0.5rem;
                    }
                }

                .calendar-container .react-datepicker__navigation--next {
                    right: 1rem;
                    border-left-color: #9ca3af;
                }

                @media (max-width: 768px) {
                    .calendar-container .react-datepicker__navigation--next {
                        right: 0.5rem;
                    }
                }

                .calendar-container .unavailable-day::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 16px;
                    height: 2px;
                    background-color: #ef4444;
                    transform: translate(-50%, -50%) rotate(45deg);
                    z-index: 10;
                    pointer-events: none;
                }

                @media (max-width: 768px) {
                    .calendar-container .unavailable-day::before {
                        width: 12px;
                        height: 1.5px;
                    }
                }

                .calendar-container .react-datepicker__day > span {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
}

function Steps({ step, dict }: { step: Step; dict: Record<string,string>; }) {
    return (
        <div className="flex justify-center px-2">
            <div className="flex items-center space-x-2 sm:space-x-4 bg-zinc-700 rounded-lg p-3 sm:p-4 border border-glacier-700 shadow-md max-w-full overflow-x-auto">
                {Object.entries(dict).map(([key,label], i) => {
                    const num = i + 1;
                    const completed = num < step;
                    const active = num === step;
                    return (
                        <React.Fragment key={i}>
                            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                                <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 font-medium transition-all duration-300 text-xs sm:text-sm ${
                                        completed
                                            ? "bg-green-500 border-green-400 text-white shadow-lg"
                                            : active
                                            ? "bg-glacier-500 border-glacier-400 text-white shadow-lg ring-2 ring-glacier-300"
                                            : "bg-zinc-600 border-glacier-700 text-glacier-400"
                                    }`}
                                >
                                    {completed ? <FaCheckCircle className="text-xs sm:text-sm" /> : num}
                                </div>
                                <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${completed || active ? "text-glacier-100" : "text-glacier-400"}`}>
                                    {label}
                                </span>
                            </div>
                            {i < Object.keys(dict).length - 1 && (
                                <div className={`w-6 sm:w-12 h-0.5 transition-colors duration-300 flex-shrink-0 ${
                                    completed ? "bg-green-400" : "bg-glacier-700"
                                }`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
