"use client";
import React, { useEffect, useState } from "react";
import {
    FaUser,
    FaCalendarAlt,
    FaBed,
    FaTimes,
    FaSearch,
} from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { fetchCities } from "@/app/[lang]/accommodation/services/accommodationService";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";
import { useDictionary } from "@context";

interface SearchFilters {
    destination: string;
    dates: { checkIn: string; checkOut: string };
    guests: { adults: number; children: number; rooms: number };
}

export default function AccommodationSearchBar({
                                                   onSearch,
                                               }: {
    onSearch: (filters: SearchFilters) => void;
}) {
    const { dict } = useDictionary();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const lang = pathname.split("/")[1] || "en";

    // Destination state
    const [destination, setDestination] = useState(
        searchParams.get("destination") || ""
    );

    // Date picker locale
    registerLocale("es", es);
    setDefaultLocale("es");

    // Date range state
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        searchParams.get("checkIn")
            ? new Date(searchParams.get("checkIn") as string)
            : null,
        searchParams.get("checkOut")
            ? new Date(searchParams.get("checkOut") as string)
            : null,
    ]);

    // Guests state
    const [guests, setGuests] = useState({
        adults: Number(searchParams.get("adults")) || 2,
        children: Number(searchParams.get("children")) || 0,
        rooms: Number(searchParams.get("rooms")) || 1,
    });

    // UI toggles
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [showGuestOptions, setShowGuestOptions] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // Notification
    const [notification, setNotification] = useState<Notifications>();

    // Load cities for suggestions
    useEffect(() => {
        fetchCities()
            .then((list) => setCities(list))
            .catch((err) => console.error("Error loading cities", err));
    }, []);

    // Helpers
    const formatDateToString = (date: Date | null) =>
        date ? date.toISOString().split("T")[0] : "";

    const formatDateDisplay = (date: Date | null) =>
        date
            ? date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
                day: "numeric",
                month: "short",
            })
            : "";

    // Handlers
    const handleDestinationChange = (val: string) => {
        setDestination(val);
        if (val.trim()) {
            setFilteredCities(
                cities.filter((c) => c.toLowerCase().includes(val.toLowerCase()))
            );
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (city: string) => {
        setDestination(city);
        setShowSuggestions(false);
    };

    const handleCountChange = (
        type: keyof typeof guests,
        op: "inc" | "dec"
    ) => {
        setGuests((prev) => ({
            ...prev,
            [type]: Math.max(
                type === "adults" ? 1 : 0,
                op === "inc" ? prev[type] + 1 : prev[type] - 1
            ),
        }));
    };

    const getToday = () => new Date().toISOString().split("T")[0];

    const handleSearch = () => {
        // Validate destination
        if (!destination.trim()) {
            setNotification({
                titulo: dict.CLIENT.SEARCHBAR.NOTIF.INVALID_DEST.TITLE,
                mensaje: dict.CLIENT.SEARCHBAR.NOTIF.INVALID_DEST.MESSAGE,
                tipo: "error",
                code: 400,
            });
            return;
        }
        // Validate dates
        const todayStr = getToday();
        const [start, end] = dateRange;
        if (start) {
            const inStr = formatDateToString(start);
            if (inStr < todayStr) {
                setNotification({
                    titulo: dict.CLIENT.SEARCHBAR.NOTIF.INVALID_DATE.TITLE,
                    mensaje: dict.CLIENT.SEARCHBAR.NOTIF.INVALID_DATE.PAST,
                    tipo: "error",
                    code: 401,
                });
                return;
            }
        }
        if (start && end) {
            const inStr = formatDateToString(start);
            const outStr = formatDateToString(end);
            if (outStr < inStr) {
                setNotification({
                    titulo: dict.CLIENT.SEARCHBAR.NOTIF.INVALID_DATE.TITLE,
                    mensaje: dict.CLIENT.SEARCHBAR.NOTIF.INVALID_DATE.ORDER,
                    tipo: "error",
                    code: 402,
                });
                return;
            }
        }
        // Clear notification
        setNotification(undefined);

        // Build filters
        const filters: SearchFilters = {
            destination,
            dates: {
                checkIn: formatDateToString(dateRange[0]),
                checkOut: formatDateToString(dateRange[1]),
            },
            guests,
        };
        onSearch(filters);
        setShowMobileSearch(false);

        // Navigate
        const qp = new URLSearchParams();
        qp.append("destination", destination);
        if (dateRange[0]) qp.append("checkIn", formatDateToString(dateRange[0]));
        if (dateRange[1]) qp.append("checkOut", formatDateToString(dateRange[1]));
        qp.append("adults", String(guests.adults));
        qp.append("children", String(guests.children));
        qp.append("rooms", String(guests.rooms));
        router.push(`/${lang}/accommodation/list?${qp.toString()}`);
    };

    const dateSummary = dateRange[0] && dateRange[1]
        ? `${formatDateDisplay(dateRange[0])} - ${formatDateDisplay(dateRange[1])}`
        : dict.CLIENT.SEARCHBAR.PLACEHOLDER.DATES;

    const guestSummary = `${guests.adults} ${dict.CLIENT.SEARCHBAR.PLACEHOLDER.ADULTS} · ${guests.children} ${dict.CLIENT.SEARCHBAR.PLACEHOLDER.CHILDREN} · ${guests.rooms} ${dict.CLIENT.SEARCHBAR.PLACEHOLDER.ROOMS}`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab" && showSuggestions && filteredCities.length > 0) {
            e.preventDefault();
            const suggestion = filteredCities[0];
            setDestination(suggestion);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="flex justify-center py-2 mt-2 relative text-glacier-950">
            {/* Mobile toggle */}
            <div className="md:hidden w-[90%] bg-white border-4 border-glacier-950 rounded-xl shadow-2xl z-10">
                <button
                    className="w-full flex items-center justify-between p-4"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                    <div className="flex items-center">
                        <FaSearch className="mr-2" />
                        <span>{dict.CLIENT.SEARCHBAR.ACTIONS.SEARCH_MOBILE}</span>
                    </div>
                    <span className="truncate max-w-[150px] text-xs">
            {destination}, {guestSummary}
          </span>
                </button>
            </div>

            {/* Mobile panel */}
            {showMobileSearch && (
                <div className="md:hidden fixed inset-0 bg-gradient-to-b from-glacier-800 to-glacier-950 z-50 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 border-b border-glacier-700 pb-3">
                        <h2 className="text-lg font-semibold text-white">
                            {dict.CLIENT.SEARCHBAR.ACTIONS.SEARCH_MOBILE}
                        </h2>
                        <button
                            onClick={() => setShowMobileSearch(false)}
                            className="p-2 text-white bg-glacier-700/50 rounded-full"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    {/* Destination */}
                    <div className="mb-4">
                        <label className="block mb-1 text-glacier-100">
                            {dict.CLIENT.SEARCHBAR.LABEL.DESTINATION}
                        </label>
                        <div className="relative flex items-center border-2 border-glacier-600 bg-glacier-100/90 rounded-xl p-2.5">
                            <FaBed className="mr-2 text-glacier-700" />
                            <input
                                type="text"
                                value={destination}
                                placeholder={dict.CLIENT.SEARCHBAR.PLACEHOLDER.DESTINATION}
                                onChange={e => handleDestinationChange(e.target.value)}
                                onFocus={() => filteredCities.length > 0 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                onKeyDown={handleKeyDown}                   // ← aquí
                                className="w-full bg-transparent outline-none text-glacier-950"
                                autoComplete="off"
                            />
                            {destination && (
                                <button onClick={() => setDestination("")}>
                                    <FaTimes className="ml-2 text-glacier-600 hover:text-glacier-800" />
                                </button>
                            )}
                        </div>
                        {showSuggestions && (
                            <ul className="absolute bg-glacier-100 border-2 border-glacier-600 rounded-xl shadow-xl mt-2 w-full max-h-40 overflow-y-auto z-50">
                                {filteredCities.map((city) => (
                                    <li
                                        key={city}
                                        className="p-2.5 hover:bg-glacier-200 cursor-pointer text-glacier-800"
                                        onMouseDown={() => handleSuggestionClick(city)}
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="mb-4">
                        <label className="block mb-1 text-glacier-100">
                            {dict.CLIENT.SEARCHBAR.LABEL.DATES}
                        </label>
                        <div className="border-2 border-glacier-600 bg-glacier-100/90 rounded-xl p-4">
                            <DatePicker
                                selectsRange
                                startDate={dateRange[0]}
                                endDate={dateRange[1]}
                                minDate={new Date()}
                                onChange={setDateRange}
                                dateFormat="dd/MM/yyyy"
                                inline
                                locale="es"
                            />
                        </div>
                    </div>

                    {/* Guests */}
                    <div className="mb-6">
                        <label className="block mb-1 text-glacier-100">
                            {dict.CLIENT.SEARCHBAR.LABEL.GUESTS}
                        </label>
                        <div className="border-2 border-glacier-600 bg-glacier-100/90 rounded-xl p-4">
                            {(Object.keys(guests) as Array<keyof typeof guests>).map((type) => (
                                <div key={type} className="flex justify-between items-center mb-3 last:mb-0">
                  <span className="capitalize text-glacier-900 font-medium">
                    {dict.CLIENT.SEARCHBAR.PLACEHOLDER[type.toUpperCase() as "ADULTS" | "CHILDREN" | "ROOMS"]}
                  </span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCountChange(type, "dec")}
                                            disabled={guests[type] <= (type === "adults" ? 1 : 0)}
                                            className="w-8 h-8 flex items-center justify-center bg-glacier-200 border border-glacier-600 rounded-full disabled:opacity-50 text-glacier-800"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-medium text-glacier-900">{guests[type]}</span>
                                        <button
                                            onClick={() => handleCountChange(type, "inc")}
                                            className="w-8 h-8 flex items-center justify-center bg-glacier-200 border border-glacier-600 rounded-full text-glacier-800"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search button mobile */}
                    <button
                        className="w-full px-4 py-3.5 bg-glacier-600 text-white rounded-xl hover:bg-glacier-700 font-medium shadow-lg transform hover:scale-[1.02] transition-transform"
                        onClick={handleSearch}
                    >
                        {dict.CLIENT.SEARCHBAR.ACTIONS.SEARCH}
                    </button>
                </div>
            )}

            {/* Desktop search bar */}
            <div className="hidden md:flex max-w-5xl bg-zinc-800 border-4 border-glacier-600 rounded-full shadow-2xl px-4 py-2 items-center gap-3">
                {/* DESTINO (escritorio) */}
                <div className="relative flex-1">
                    <label className="sr-only">{dict.CLIENT.SEARCHBAR.LABEL.DESTINATION}</label>
                    <div className="flex items-center border border-zinc-600 rounded-full px-3 py-2 bg-zinc-700 hover:bg-zinc-600 transition-colors">
                        <FaBed className="mr-2 text-glacier-400" />

                        {/* contenedor relativo para overlay + input */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={destination}
                                placeholder={dict.CLIENT.SEARCHBAR.PLACEHOLDER.DESTINATION}
                                onChange={e => handleDestinationChange(e.target.value)}
                                onFocus={() => filteredCities.length > 0 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                                className="relative z-10 w-full bg-transparent outline-none text-glacier-100 placeholder-glacier-400"
                            />

                            {/* overlay inline */}
                            {showSuggestions && filteredCities.length > 0 && destination && (
                                <div className="absolute inset-y-0 left-0 flex items-center pl-0 pointer-events-none">
                                    <span className="invisible">{destination}</span>
                                    <span className="text-glacier-500">
            {filteredCities[0].slice(destination.length)}
          </span>
                                </div>
                            )}
                        </div>

                        {destination && (
                            <button onClick={() => setDestination("")}>
                                <FaTimes className="ml-2 text-glacier-500 hover:text-glacier-300 transition-colors" />
                            </button>
                        )}
                    </div>

                    {/* listado de sugerencias */}
                    {showSuggestions && filteredCities.length > 0 && (
                        <ul className="absolute bg-zinc-800 border border-glacier-600 rounded-lg shadow-xl mt-1 w-full max-h-40 overflow-y-auto z-50 custom-scrollbar">
                            {filteredCities.map(city => (
                                <li
                                    key={city}
                                    className="p-2 hover:bg-zinc-700 cursor-pointer text-glacier-200 hover:text-glacier-100 transition-colors"
                                    onMouseDown={() => handleSuggestionClick(city)}
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Dates */}
                <div className="flex items-center flex-1 border-l border-glacier-600 pl-4">
                    <FaCalendarAlt className="mr-2 text-glacier-400" />
                    <div className="flex items-center border border-zinc-600 rounded-full px-3 py-2 bg-zinc-700 hover:bg-zinc-600 transition-colors">
                        <DatePicker
                            selectsRange
                            startDate={dateRange[0]}
                            endDate={dateRange[1]}
                            onChange={setDateRange}
                            minDate={new Date()}
                            placeholderText={dict.CLIENT.SEARCHBAR.PLACEHOLDER.DATES}
                            dateFormat="dd/MM/yyyy"
                            locale="es"
                            className="outline-none cursor-pointer bg-transparent text-glacier-100 placeholder-glacier-400"
                            customInput={
                                <input 
                                    className="outline-none cursor-pointer bg-transparent text-glacier-100 placeholder-glacier-400" 
                                    readOnly 
                                />
                            }
                            calendarClassName="bg-zinc-800 border-glacier-600"
                        />
                    </div>
                </div>

                {/* Guests */}
                <div className="relative">
                    <button
                        className="flex items-center px-3 py-2 border border-zinc-600 rounded-full bg-zinc-700 hover:bg-zinc-600 text-glacier-200 transition-colors"
                        onClick={() => setShowGuestOptions(!showGuestOptions)}
                    >
                        <FaUser className="mr-2 text-glacier-400" />
                        <span className="truncate max-w-[150px]">{guestSummary}</span>
                    </button>
                    {showGuestOptions && (
                        <div className="absolute top-full left-0 mt-2 bg-zinc-800 border border-glacier-600 shadow-2xl p-4 rounded-lg w-64 z-50">
                            {(Object.keys(guests) as Array<keyof typeof guests>).map((type) => (
                                <div key={type} className="flex justify-between items-center mb-3">
                                    <span className="text-glacier-200 font-medium">
                                        {dict.CLIENT.SEARCHBAR.PLACEHOLDER[type.toUpperCase() as "ADULTS" | "CHILDREN" | "ROOMS"]}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleCountChange(type, "dec")} 
                                            disabled={guests[type] <= (type === "adults" ? 1 : 0)} 
                                            className="w-8 h-8 flex items-center justify-center bg-zinc-700 border border-glacier-600 rounded-full disabled:opacity-50 text-glacier-200 hover:bg-zinc-600 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-medium text-glacier-100">{guests[type]}</span>
                                        <button 
                                            onClick={() => handleCountChange(type, "inc")} 
                                            className="w-8 h-8 flex items-center justify-center bg-zinc-700 border border-glacier-600 rounded-full text-glacier-200 hover:bg-zinc-600 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setShowGuestOptions(false)} 
                                className="w-full bg-glacier-600 text-white py-2 rounded-full hover:bg-glacier-700 transition-colors font-medium"
                            >
                                {dict.CLIENT.SEARCHBAR.ACTIONS.DONE}
                            </button>
                        </div>
                    )}
                </div>

                {/* Search button */}
                <button 
                    onClick={handleSearch} 
                    className="px-6 py-3 bg-glacier-600 text-white rounded-full hover:bg-glacier-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                >
                    <FaSearch className="inline mr-2" />
                    {dict.CLIENT.SEARCHBAR.ACTIONS.SEARCH}
                </button>
            </div>

            {notification && (
                <NotificationComponent Notifications={notification} onClose={() => setNotification(undefined)} />
            )}
        </div>
    );
}
