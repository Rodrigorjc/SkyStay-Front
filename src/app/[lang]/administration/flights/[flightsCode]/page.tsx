"use client";
import { useDictionary } from "@/app/context/DictionaryContext";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import { FlightsDetailsVO } from "./types/detailsFlight";
import { getCabinsByCode, getFlightByCode } from "../services/flight.service";
import { InfoCardFlight } from "@/app/components/ui/admin/InfoCard";
import { CabinsInfoVO } from "../types/flight";
import Image from "next/image";

export default function FlightsDetails() {
  const { dict } = useDictionary();
  const { flightsCode } = useParams();
  const { lang } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<FlightsDetailsVO>();
  const [cabins, setCabins] = useState<CabinsInfoVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFlightDetails = useCallback(async () => {
    try {
      const response = await getFlightByCode(flightsCode as string);
      const responseCabins = await getCabinsByCode(flightsCode as string);
      setFlight(response.response.objects);
      setCabins(responseCabins.response.objects);
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{dict.ADMINISTRATION.ERROR_LOAD_FLIGHT}</p>
        </div>
      );
    } finally {
      setLoading(false);
    }
  }, [dict.ADMINISTRATION.ERROR_LOAD_FLIGHT, flightsCode]);

  useEffect(() => {
    fetchFlightDetails();
  }, [flightsCode, fetchFlightDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{dict.ADMINISTRATION.ERROR_LOAD_FLIGHT}</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-6 m-4 rounded-md">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Información General del Vuelo */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6 cursor-pointer" onClick={() => router.push(`/${lang}/administration/users`)}>
            {dict.ADMINISTRATION.FLIGHT_DETAILS.TITLE}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CODE} value={flight.code} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.STATUS} value={flight.status} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.DATE} value={new Date(flight.dateTime).toLocaleString()} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.ARRIVAL} value={new Date(flight.dateTimeArrival).toLocaleString()} />
          </div>
        </section>

        {/* Aerolínea */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6">{dict.ADMINISTRATION.FLIGHT_DETAILS.AIRLINE}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.NAME} value={flight.airline.name} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.PHONE} value={flight.airline.phone} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.EMAIL} value={flight.airline.email} />
            <InfoCardFlight
              label={dict.ADMINISTRATION.FLIGHT_DETAILS.WEBSITE}
              value={
                <a href={flight.airline.website} target="_blank" rel="noopener noreferrer" className="underline text-glacier-300">
                  {flight.airline.website}
                </a>
              }
            />
          </div>
          {flight.airline.image && (
            <>
              {flight.airline.image && (
                <section className="mt-6">
                  <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-4">{dict.ADMINISTRATION.HOTEL_DETAILS.IMAGE}</h2>
                  <Image src={flight.airline.image} alt={flight.airline.name} width={288} height={288} className="w-full h-72 object-cover rounded-xl shadow-md border border-zinc-700" />
                </section>
              )}
            </>
          )}
        </section>

        {/* Aeropuerto de Salida y Llegada */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase">{dict.ADMINISTRATION.FLIGHT_DETAILS.AIRPORT}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
            <div>
              <h3 className="text-zinc-300 font-semibold text-lg mb-2">{dict.ADMINISTRATION.FLIGHT_DETAILS.DEPARTURE_AIRPORT}</h3>
              <div className="flex flex-col gap-4">
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.AIRPORT_NAME} value={flight.departureAirport.name} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.TERMINAL} value={flight.departureAirport.terminal} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.GATE} value={flight.departureAirport.gate} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CITY} value={flight.departureAirport.city.name} />
              </div>
            </div>
            <div>
              <h3 className="text-zinc-300 font-semibold text-lg mb-2">{dict.ADMINISTRATION.FLIGHT_DETAILS.ARRIVAL_AIRPORT}</h3>
              <div className="flex flex-col gap-4">
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.AIRPORT_NAME} value={flight.arrivalAirport.name} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.TERMINAL} value={flight.arrivalAirport.terminal} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.GATE} value={flight.arrivalAirport.gate} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CITY} value={flight.arrivalAirport.city.name} />
              </div>
            </div>
          </div>
        </section>

        {/* Avión */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6">{dict.ADMINISTRATION.FLIGHT_DETAILS.AIRPLANE}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.MODEL} value={flight.airplane.model} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.TYPE} value={flight.airplane.airplaneType.name} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.MANUFACTURER} value={flight.airplane.airplaneType.manufacturer} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CAPACITY} value={flight.airplane.airplaneType.capacity} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.STATUS} value={flight.airplane.status} />
            <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.REGISTRATION} value={flight.airplane.registrationNumber} />
          </div>
        </section>

        {/* Cabinas */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6">{dict.ADMINISTRATION.FLIGHT_DETAILS.CABINS}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabins.map(cabin => (
              <div key={cabin.id} className="flex flex-col gap-4 ">
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CABIN_SEAT_CLASS} value={cabin.seatClass} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CABIN_PRICE} value={`$${cabin.price.toFixed(2)}`} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CABIN_TOTAL_SEATS} value={cabin.totalSeats} />
                <InfoCardFlight label={dict.ADMINISTRATION.FLIGHT_DETAILS.CABIN_AVAILABLE_SEATS} value={cabin.availableSeats} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
