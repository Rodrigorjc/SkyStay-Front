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
        const today = new Date(); today.setHours(0,0,0,0);
        if (date < today || (startDate && date < startDate) || !availableDates.length) return false;
        return availableDates.some(r => {
            const s = parse(r.startDate, "yyyy-MM-dd", new Date());
            const e = parse(r.endDate, "yyyy-MM-dd", new Date());
            return date >= s && date <= e;
        });
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [s, e] = dates;
        if (s && e && s.getTime() === e.getTime()) { setStartDate(s); setEndDate(null); return; }
        setStartDate(s);
        setEndDate(e);
        if (s && e) {
            const ps = new URLSearchParams(searchParams.toString());
            ps.set("checkIn", format(s, "yyyy-MM-dd"));
            ps.set("checkOut", format(e, "yyyy-MM-dd"));
            window.history.replaceState({}, "", `${window.location.pathname}?${ps}`);
        }
    };



    if (error)
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-glacier-500 text-white rounded"
                    onClick={() => router.back()}
                >
                    {dict.CLIENT.RESERVATION.BUTTON.BACK}
                </button>
            </div>
        );

    const nights = startDate && endDate
        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
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
        return <div className="text-center py-8"><Loader></Loader></div>;

    return (
        <div className="max-w-6xl mx-auto py-4 px-4">
            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}

            {/* Pasos */}
            <div className="mb-8 px-2">
                <Steps step={step} dict={dict.CLIENT.RESERVATION.STEPS} />
            </div>

            {/* Detalles */}
            {step === Step.Detalles && (
                <div className="bg-zinc-900 rounded-lg p-4 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-glacier-100">
                        {dict.CLIENT.RESERVATION.TITLES.DETAILS}
                    </h2>

                    {accommodation && (
                        <div className="mb-6 bg-zinc-800 p-4 rounded hover:shadow-md">
                            <h3 className="font-semibold text-lg mb-2 text-white">
                                {accommodation.name}
                            </h3>
                            <p className="text-sm text-glacier-300 mb-2">
                                {accommodation.address}
                            </p>
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

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Selector de fechas */}
                        <div className="bg-zinc-800 p-4 rounded">
                            <h3 className="font-semibold mb-3 text-glacier-200">
                                {dict.CLIENT.RESERVATION.LABELS.DATES}
                            </h3>
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateChange}
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                                selectsRange
                                inline
                                locale={es}
                                renderDayContents={(day, date) => (
                                    <div
                                        className={`font-semibold ${
                                            isDateAvailable(date)
                                                ? "text-green-500"
                                                : "text-red-500 line-through"
                                        }`}
                                    >
                                        {day}
                                    </div>
                                )}
                                filterDate={isDateAvailable}
                                disabledKeyboardNavigation
                            />
                            {startDate && endDate && (
                                <div className="mt-4 text-center bg-zinc-700 inline-block px-4 py-2 rounded">
                                    <p className="text-sm">
                                        <strong>{dict.CLIENT.RESERVATION.LABELS.CHECKIN}:</strong>{" "}
                                        {format(startDate, "dd/MM/yyyy")}
                                    </p>
                                    <p className="text-sm">
                                        <strong>{dict.CLIENT.RESERVATION.LABELS.CHECKOUT}:</strong>{" "}
                                        {format(endDate, "dd/MM/yyyy")}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Habitaciones o apartamento */}
                        <div>
                            <div className="bg-zinc-800 p-4 rounded">
                                {isApartment ? (
                                    <>
                                        <h3 className="font-semibold mb-2 text-glacier-200">
                                            {dict.CLIENT.RESERVATION.LABELS.APARTMENT}
                                        </h3>
                                        <p className="text-sm text-glacier-300">
                                            {dict.CLIENT.RESERVATION.MSG.APARTMENT_FULL}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold mb-2 text-glacier-200">
                                            {dict.CLIENT.RESERVATION.LABELS.ROOMS}
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedRooms.map((room) => {
                                                const info = accommodation?.availableRooms?.find(
                                                    (r) => r.roomConfigId.toString() === room.roomId
                                                );
                                                const typeLabel = info?.roomType || dict.CLIENT.RESERVATION.DEFAULT.ROOM_TYPE;
                                                const cap = info?.capacity || 1;
                                                return (
                                                    <li
                                                        key={room.roomId}
                                                        className="flex justify-between items-center py-2 px-3 bg-zinc-700 rounded-md"
                                                    >
                                                        <div>
                                                            <span className="font-medium text-white">
                                                                {typeLabel}
                                                            </span>
                                                            <div className="text-xs text-glacier-300 mt-1">
                                                                {dict.CLIENT.RESERVATION.MSG.CAPACITY} {cap}
                                                            </div>
                                                        </div>
                                                        <div className="bg-glacier-600 text-white px-2 py-1 rounded-full text-sm">
                                                            x{room.qty}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                )}
                            </div>

                            {/* Disponibilidad */}
                            {availableDates.length > 0 && (
                                <div className="mb-4 mt-6 bg-zinc-800 rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 text-glacier-200">
                                        {dict.CLIENT.RESERVATION.LABELS.AVAILABILITY}
                                    </h3>
                                    <ul className="text-sm text-glacier-100 flex flex-wrap gap-2">
                                        {availableDates.map((range) => (
                                            <li key={range.startDate} className="bg-glacier-700 px-2 py-1 rounded">
                                                {`${range.startDate} → ${range.endDate}`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            className="py-2 px-6 rounded-lg font-medium bg-glacier-500 hover:bg-glacier-600 text-white transition-opacity"
                            onClick={() => {
                                if (!startDate || !endDate) {
                                    setNotification({
                                        titulo: dict.CLIENT.RESERVATION.ERROR.TITLE,
                                        mensaje: dict.CLIENT.RESERVATION.ERROR.DATES,
                                        tipo: "error",
                                        code: 400,
                                    });
                                    return;
                                }
                                const has = availableDates.some((r) => {
                                    const s = parse(r.startDate, "yyyy-MM-dd", new Date());
                                    const e = parse(r.endDate, "yyyy-MM-dd", new Date());
                                    return (
                                        isWithinInterval(startDate, { start: s, end: e }) &&
                                        isWithinInterval(addDays(endDate, -1), { start: s, end: e })
                                    );
                                });
                                if (!has) {
                                    setNotification({
                                        titulo: dict.CLIENT.RESERVATION.ERROR.TITLE,
                                        mensaje: dict.CLIENT.RESERVATION.ERROR.NO_AVAIL,
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
                <div className="bg-zinc-900 rounded-lg p-4 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2 text-glacier-100">
                        {dict.CLIENT.RESERVATION.TITLES.PAY}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-6 bg-zinc-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-3 text-glacier-200">
                                {dict.CLIENT.RESERVATION.LABELS.SUMMARY}
                            </h3>
                            <div className="space-y-2 text-sm text-glacier-300">
                                <div className="flex justify-between border-b border-zinc-700 pb-2">
                                    <span>{dict.CLIENT.RESERVATION.LABELS.ACCOMMODATION}</span>
                                    <span className="font-medium">{accommodation?.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-700 pb-2">
                                    <span>{dict.CLIENT.RESERVATION.LABELS.CHECKIN}</span>
                                    <span>{startDate ? format(startDate, "dd/MM/yyyy") : "-"}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-700 pb-2">
                                    <span>{dict.CLIENT.RESERVATION.LABELS.CHECKOUT}</span>
                                    <span>{endDate ? format(endDate, "dd/MM/yyyy") : "-"}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-700 pb-2">
                                    <span>{dict.CLIENT.RESERVATION.LABELS.TYPE}</span>
                                    <span>
                    {isApartment
                        ? dict.CLIENT.RESERVATION.MSG.APARTMENT_FULL
                        : dict.CLIENT.RESERVATION.MSG.ROOMS}
                  </span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="font-semibold">{dict.CLIENT.RESERVATION.LABELS.TOTAL}</span>
                                    <span className="font-bold text-glacier-300">{total}€</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center">
                            <button
                                className="py-2 px-6 mb-4 rounded-lg font-medium bg-glacier-500 hover:bg-glacier-600 text-white"
                                onClick={() => setShowPaymentForm(true)}
                            >
                                {dict.CLIENT.RESERVATION.BUTTON.PAY}
                            </button>
                            {showPaymentForm && (
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
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Steps({ step, dict }: { step: Step; dict: Record<string,string>; }) {
    return (
        <div className="flex justify-between items-center">
            {Object.entries(dict).map(([key,label], i) => {
                const num = i + 1;
                const completed = num < step;
                const active = num === step;
                return (
                    <React.Fragment key={i}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-glacier-500 text-white \${
                  completed
                    ? "bg-green-500"
                    : active
                    ? "bg-glacier-500"
                    : "bg-zinc-700 text-glacier-300"
                }`}
                            >
                                {completed ? "✓" : num}
                            </div>
                            <span className={`text-xs \${completed || active ? "text-glacier-100" : "text-glacier-400"}`}>{label}</span>
                        </div>
                        {i < Object.keys(dict).length - 1 && (
                            <div className="flex-1 h-0.5 bg-glacier-700 mx-2" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
