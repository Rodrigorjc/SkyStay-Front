import React, {useEffect, useState} from "react";
import { FaUser, FaCalendarAlt, FaBed, FaTimes, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@components/Notification";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import {fetchCities} from "@/app/[lang]/accommodation/services/accommodationService";

interface SearchFilters {
    destination: string;
    dates: { checkIn: string; checkOut: string };
    guests: { adults: number; children: number; rooms: number };
}

export default function AccommodationSearchBar({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
    const searchParams = useSearchParams();
    const [destination, setDestination] = useState(searchParams.get("destination") || "");
    registerLocale('es', es);
    setDefaultLocale('es');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        searchParams.get("checkIn") ? new Date(searchParams.get("checkIn") as string) : null,
        searchParams.get("checkOut") ? new Date(searchParams.get("checkOut") as string) : null
    ]);
    const [cities, setCities] = useState<string[]>([]);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const formatDateToString = (date: Date | null): string => {
        return date ? date.toISOString().split('T')[0] : '';
    };
    const handleDateRangeChange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
    };
    const [guests, setGuests] = useState({
        adults: Number(searchParams.get("adults")) || 2,
        children: Number(searchParams.get("children")) || 0,
        rooms: Number(searchParams.get("rooms")) || 1
    });
    const [showGuestOptions, setShowGuestOptions] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const lang = pathname.split("/")[1] || "en";
    const [notification, setNotification] = useState<Notifications>();

    useEffect(() => {
        const loadCities = async () => {
            try {
                const cityList = await fetchCities();
                setCities(cityList);
            } catch (error) {
                console.error("Error al cargar las ciudades:", error);
            }
        };

        loadCities();
    }, []);

    const handleDestinationChange = (value: string) => {
        setDestination(value);
        if (value.trim()) {
            const suggestions = cities.filter((city) =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCities(suggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleFocus = () => {
        if (filteredCities.length > 0) setShowSuggestions(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    const handleSuggestionClick = (city: string) => {
        setDestination(city);
        setShowSuggestions(false);
    };

    const handleCountChange = (type: 'adults' | 'children' | 'rooms', op: 'inc' | 'dec') => {
        setGuests((prev) => {
            const val = op === "inc" ? prev[type as keyof typeof prev] + 1 : prev[type as keyof typeof prev] - 1;
            return {
                ...prev,
                [type]: Math.max(type === "adults" ? 1 : 0, val),
            };
        });
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSearch = () => {
        // Validación de destino
        if (!destination.trim()) {
            setNotification({
                titulo: "Datos inválidos",
                mensaje: "Por favor, introduce un destino",
                tipo: "error",
                code: 401
            });
            return;
        }

        // Validación de fechas
        const today = getTodayDate();

        // Si hay fecha de entrada, verificar que no sea anterior a hoy
        if (dateRange[0] && formatDateToString(dateRange[0]) < today) {
            setNotification({
                titulo: "Fecha inválida",
                mensaje: "La fecha de entrada no puede ser anterior a hoy",
                tipo: "error",
                code: 402
            });
            return;
        }

        // Si hay ambas fechas, verificar que check-out sea posterior a check-in
        if (dateRange[0] && dateRange[1] && formatDateToString(dateRange[1]) < formatDateToString(dateRange[0])) {
            setNotification({
                titulo: "Fecha inválida",
                mensaje: "La fecha de salida debe ser posterior a la de entrada",
                tipo: "error",
                code: 403
            });
            return;
        }

        setNotification(undefined);

        // Resto del código de búsqueda original...
        const filters = { destination, dates: { checkIn: formatDateToString(dateRange[0]), checkOut: formatDateToString(dateRange[1]) }, guests };
        onSearch(filters);
        setShowMobileSearch(false);

        const params = new URLSearchParams();
        params.append("destination", destination);

        if (dateRange[0]) params.append("checkIn", formatDateToString(dateRange[0]));
        if (dateRange[1]) params.append("checkOut", formatDateToString(dateRange[1]));

        params.append("adults", String(guests.adults));
        params.append("children", String(guests.children));
        params.append("rooms", String(guests.rooms));

        router.push(`/${lang}/accommodation/list?${params.toString()}`);
    };

    const formatDateDisplay = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    const dateRangeSummary = dateRange[0] && dateRange[1]
        ? `${formatDateDisplay(dateRange[0])} - ${formatDateDisplay(dateRange[1])}`
        : dateRange[0]
            ? `Desde ${formatDateDisplay(dateRange[0])}`
            : "Seleccionar fechas";

    const guestSummary = `${guests.adults} adultos · ${guests.children} niños · ${guests.rooms} habitación`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && showSuggestions && filteredCities.length > 0) {
            e.preventDefault();
            setDestination(filteredCities[0]);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="flex justify-center py-8">
            {/* Botón de búsqueda móvil */}
            <div className="md:hidden w-[90%] bg-white border-4 border-glacier-950 rounded-xl shadow-2xl z-10">
                <button
                    className="w-full flex items-center justify-between p-4 text-gray-700"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                    <div className="flex items-center">
                        <FaSearch className="mr-2" />
                        <span className="text-sm">Buscar alojamiento</span>
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {destination}, {guestSummary}
                    </span>
                </button>
            </div>

            {/* Panel de búsqueda móvil */}
            {showMobileSearch && (
                <div className="md:hidden fixed inset-0 bg-gradient-to-b from-glacier-800 to-glacier-950 z-50 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 border-b border-glacier-700 pb-3">
                        <h2 className="text-lg font-semibold text-white">Buscar alojamiento</h2>
                        <button
                            onClick={() => setShowMobileSearch(false)}
                            className="p-2 text-glacier-200 hover:text-white bg-glacier-700/50 rounded-full"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Destino en móvil */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-glacier-100">Destino</label>
                        <div className="relative">
                            <div className="flex items-center border-2 border-glacier-600 bg-glacier-100/90 rounded-xl p-2.5">
                                <FaBed className="text-glacier-700 mr-2" />
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        value={destination}
                                        placeholder="Destino"
                                        onChange={e => handleDestinationChange(e.target.value)}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className="w-full outline-none bg-transparent text-glacier-950"
                                        autoComplete="off"
                                    />
                                    {showSuggestions && filteredCities.length > 0 && destination && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="flex">
                                                <span className="invisible">{destination}</span>
                                                <span className="text-glacier-600">{filteredCities[0].slice(destination.length)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {destination && (
                                    <button onClick={() => setDestination("")}>
                                        <FaTimes className="ml-2 text-glacier-600 hover:text-glacier-800" />
                                    </button>
                                )}
                            </div>
                            {showSuggestions && (
                                <ul className="absolute bg-glacier-100 border-2 border-glacier-600 rounded-xl shadow-xl mt-2 w-full max-h-40 overflow-y-auto z-50">
                                    {filteredCities.map(city => (
                                        <li
                                            key={city}
                                            className="p-2.5 hover:bg-glacier-200 cursor-pointer text-glacier-800 border-b border-glacier-200 last:border-0"
                                            onMouseDown={() => handleSuggestionClick(city)}
                                        >
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-glacier-100">Fechas</label>
                        <div className="border-2 border-glacier-600 bg-glacier-100/90 rounded-xl p-4 flex justify-center">
                            <DatePicker
                                selectsRange={true}
                                startDate={dateRange[0]}
                                endDate={dateRange[1]}
                                minDate={new Date()}
                                onChange={handleDateRangeChange}
                                dateFormat="dd/MM/yyyy"
                                monthsShown={1}
                                inline
                                className="w-full"
                                placeholderText="Selecciona fechas"
                                calendarClassName="custom-calendar bg-glacier-100 border-glacier-600 rounded-xl shadow-xl"
                                locale="es"
                            />
                        </div>
                    </div>

                    {/* Huéspedes */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1 text-glacier-100">Huéspedes</label>
                        <div className="border-2 border-glacier-600 bg-glacier-100/90 rounded-xl p-4">
                            {["adults", "children", "rooms"].map((type) => (
                                <div key={type} className="flex justify-between items-center mb-3 last:mb-0">
                        <span className="capitalize text-glacier-900 font-medium">
                            {type === "adults"
                                ? "Adultos"
                                : type === "children"
                                    ? "Niños"
                                    : "Habitaciones"}
                        </span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCountChange(type as 'adults' | 'children' | 'rooms', "dec")}
                                            disabled={guests[type as keyof typeof guests] <= (type === "adults" ? 1 : 0)}
                                            className="w-8 h-8 flex items-center justify-center bg-glacier-200 border border-glacier-600 rounded-full disabled:opacity-50 text-glacier-800"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-medium text-glacier-900">{guests[type as keyof typeof guests]}</span>
                                        <button
                                            onClick={() => handleCountChange(type as 'adults' | 'children' | 'rooms', "inc")}
                                            className="w-8 h-8 flex items-center justify-center bg-glacier-200 border border-glacier-600 rounded-full text-glacier-800"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="w-full px-4 py-3.5 bg-glacier-600 text-white rounded-xl hover:bg-glacier-700 font-medium shadow-lg transform hover:scale-[1.02] transition-transform"
                        onClick={handleSearch}
                    >
                        Buscar
                    </button>
                </div>
            )}

            {/* Barra de búsqueda para escritorio */}
            <div className="hidden md:block max-w-5xl bg-glacier-100 border-4 border-glacier-800 text-glacier-950 rounded-full shadow-2xl px-4 ">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-2">
                    {/* Destino */}
                    <div className="relative">
                        <div className="flex items-center border rounded-full p-2">
                            <FaBed className="text-gray-600 mr-2" />
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={destination}
                                    placeholder="Destino"
                                    onChange={e => handleDestinationChange(e.target.value)}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full outline-none"
                                    autoComplete="off"
                                    onKeyDown={handleKeyDown}
                                />
                                {showSuggestions && filteredCities.length > 0 && destination && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="flex">
                                            <span className="invisible">{destination}</span>
                                            <span className="text-gray-400">{filteredCities[0].slice(destination.length)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {destination && (
                                <button onClick={() => setDestination("")}>
                                    <FaTimes className="ml-2 text-gray-400 hover:text-black" />
                                </button>
                            )}
                        </div>
                        {showSuggestions && (
                            <ul className="absolute bg-glacier-100 border border-glacier-600 rounded-lg shadow-md mt-2 w-full max-h-40 overflow-y-hidden z-50">
                                {filteredCities.map(city => (
                                    <li
                                        key={city}
                                        className="p-2 hover:bg-glacier-100 cursor-pointer text-glacier-800"
                                        onMouseDown={() => handleSuggestionClick(city)}
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Fechas */}
                    <div className="flex items-center flex-1 lg:border-r lg:pr-4">
                        <FaCalendarAlt className="text-gray-600 mr-2" />
                        <DatePicker
                            selectsRange={true}
                            startDate={dateRange[0]}
                            endDate={dateRange[1]}
                            onChange={handleDateRangeChange}
                            minDate={new Date()}
                            className="w-full outline-none cursor-pointer"
                            placeholderText="Selecciona fechas"
                            dateFormat="dd/MM/yyyy"
                            locale="es"
                            isClearable={false}
                            customInput={
                                <input
                                    className="w-full outline-none cursor-pointer"
                                    placeholder="Selecciona fechas"
                                    readOnly
                                />
                            }
                        />
                    </div>

                    {/* Huéspedes */}
                    <div className="relative flex items-center">
                        <button
                            onClick={() => setShowGuestOptions(!showGuestOptions)}
                            className="flex items-center px-3 py-2 border rounded-full hover:bg-gray-100 w-full lg:w-auto"
                        >
                            <FaUser className="mr-2" />
                            <span className="truncate">{guestSummary}</span>
                        </button>

                        {showGuestOptions && (
                            <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg p-4 rounded-lg w-64 z-50">
                                {["adults", "children", "rooms"].map((type) => (
                                    <div key={type} className="flex justify-between items-center mb-3">
                                        <span className="capitalize">
                                            {type === "adults"
                                                ? "Adultos"
                                                : type === "children"
                                                    ? "Niños"
                                                    : "Habitaciones"}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCountChange(type as 'adults' | 'children' | 'rooms', "dec")}
                                                disabled={guests[type as keyof typeof guests] <= (type === "adults" ? 1 : 0)}
                                                className="px-2 py-1 border rounded disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span>{guests[type as keyof typeof guests]}</span>
                                            <button
                                                onClick={() => handleCountChange(type as 'adults' | 'children' | 'rooms', "inc")}
                                                className="px-2 py-1 border rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setShowGuestOptions(false)}
                                    className="w-full bg-glacier-600 text-white py-1 rounded-full hover:bg-glacier-700"
                                >
                                    Listo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botón Buscar */}
                    <button
                        className="px-4 py-3 bg-glacier-600 text-white rounded-full hover:bg-glacier-700"
                        onClick={handleSearch}
                    >
                        Buscar
                    </button>
                </div>
            </div>
            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
        </div>
    );
}