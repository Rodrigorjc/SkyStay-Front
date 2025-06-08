import Link from "next/link";
import { FlightClientVO } from "../types/flight";
import { useDictionary } from "@/app/context/DictionaryContext";

export const FlightCard: React.FC<{ flights: FlightClientVO[] }> = ({ flights }) => {
  const { dict } = useDictionary();

  const getDuration = (start: string, end: string) => {
    if (!start || !end) return "N/A";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const durationMs = endDate.getTime() - startDate.getTime();
    if (isNaN(durationMs)) return "N/A";

    const durationMin = Math.abs(durationMs / 60000);
    const hours = Math.floor(durationMin / 60);
    const minutes = Math.floor(durationMin % 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      {flights.map(flight => {
        const duration = getDuration(flight.departureTime, flight.dateTimeArrival);
        const lowSeats = flight.seatsLeft <= 5 && flight.seatsLeft > 0;
        const noSeats = flight.seatsLeft === 0;

        return (
          <div
            key={flight.code}
            className={`w-full rounded-2xl shadow-lg p-6 border backdrop-blur-xl transition flex flex-col justify-between
            ${noSeats ? "bg-zinc-700/50 border-zinc-600 text-glacier-400 opacity-60" : "bg-zinc-800/80 border-glacier-700/60 hover:ring-2 hover:ring-glacier-400/50 text-glacier-100"}`}>
            <div>
              {/* Sección superior con mejoras */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold">{flight.airlineName}</h2>
                  <p className="text-base font-medium">
                    {flight.departureCity} ({flight.departureIATA}) → {flight.arrivalCity} ({flight.arrivalIATA})
                  </p>
                  <p className="text-sm italic text-wrap text-glacier-300">
                    {flight.departureAirport} → {flight.arrivalAirport}
                  </p>
                </div>
                <div className="text-right flex flex-col gap-2">
                  <p className="text-xl font-bold">{flight.price} €</p>
                  <p className="text-sm text-glacier-400">{dict.CLIENT.FLIGHTS.LOWEST_PRICE}</p>
                </div>
              </div>

              <div className="border-t border-glacier-600/30 mb-5"></div>

              {/* Resto del contenido */}
              <div className="grid grid-cols-3 gap-5 text-sm">
                <div>
                  <p className="font-medium text-glacier-300">{dict.CLIENT.FLIGHTS.DEPATURE}</p>
                  <p>{new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div>
                  <p className="font-medium text-glacier-300">{dict.CLIENT.FLIGHTS.ARRIVAL}</p>
                  <p>{new Date(flight.dateTimeArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div>
                  <p className="font-medium text-glacier-300">{dict.CLIENT.FLIGHTS.DURATION}</p>
                  <p>{duration}</p>
                </div>
              </div>
            </div>

            {/* Sección inferior (disponibilidad y botón) */}
            <div className="mt-6 flex justify-between items-center">
              <p className={`text-sm ${lowSeats ? "text-red-400 font-semibold" : noSeats ? "text-zinc-400 italic" : "text-glacier-300"}`}>
                {noSeats
                  ? dict.CLIENT.FLIGHTS.NO_SEATS
                  : lowSeats
                  ? `${dict.CLIENT.FLIGHTS.LAST_SEATS_1} ${flight.seatsLeft} ${dict.CLIENT.FLIGHTS.LAST_SEATS_2}`
                  : `${flight.seatsLeft} ${dict.CLIENT.FLIGHTS.AVAILABLE_SEATS}`}
              </p>
              <Link
                href={`flights/${flight.code}`}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                ${noSeats ? "bg-zinc-600 text-zinc-300 cursor-not-allowed pointer-events-none" : "bg-glacier-500 hover:bg-glacier-400 text-white"}`}>
                {dict.CLIENT.FLIGHTS.DETAILS}
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
};
