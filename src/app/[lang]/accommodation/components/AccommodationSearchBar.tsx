import { useState } from "react";

export default function AccommodationSearchBar({ onSearch }) {
    const [destination, setDestination] = useState("");
    const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
    const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

    const handleSearch = () => {
        onSearch({ destination, dates, guests });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center border-2 border-yellow-400">
            <input
                type="text"
                placeholder="Madrid"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 p-2 border rounded-md"
            />
            <input
                type="date"
                value={dates.checkIn}
                onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                className="p-2 border rounded-md"
            />
            <input
                type="date"
                value={dates.checkOut}
                onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                className="p-2 border rounded-md"
            />
            <select
                value={`${guests.adults}-${guests.children}-${guests.rooms}`}
                onChange={(e) => {
                    const [adults, children, rooms] = e.target.value.split("-").map(Number);
                    setGuests({ adults, children, rooms });
                }}
                className="p-2 border rounded-md"
            >
                <option value="2-0-1">2 adultos · 0 niños · 1 habitación</option>
                <option value="1-1-1">1 adulto · 1 niño · 1 habitación</option>
                <option value="3-0-2">3 adultos · 0 niños · 2 habitaciones</option>
            </select>
            <button
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                onClick={handleSearch}
            >
                Buscar
            </button>
        </div>
    );
}
