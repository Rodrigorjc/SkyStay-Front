"use client";
import React, { use, useEffect, useState } from "react";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import { AllDetailsFlightsVO, CabinFlightDetailsVO } from "./types/flight.details";
import { MealVO } from "@/app/[lang]/administration/meals/types/meal";
import { getCabinsByCode, getFlightDetails, getMealsByFlightCode } from "./services/flight.details.service";
import Loader from "@/app/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Notifications } from "@/app/interfaces/Notifications";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
export default function FlightPage({ params }: { params: Promise<{ flightCode: string }> }) {
  const { dict } = useDictionary();
  const resolvedParams = use(params);
  const { flightCode } = resolvedParams;
  const lang = useLanguage();
  const [flightDetails, setFlightDetails] = useState<AllDetailsFlightsVO>();
  const [cabins, setCabins] = useState<CabinFlightDetailsVO[]>([]);
  const [meals, setMeals] = useState<MealVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const [notification, setNotification] = useState<Notifications | null>();

  const token = cookies.get("token");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const details = await getFlightDetails(flightCode);
        const cabins = await getCabinsByCode(flightCode);
        const meals = await getMealsByFlightCode(flightCode);
        setFlightDetails(details.response.objects);
        setCabins(cabins.response.objects);
        setMeals(meals.response.objects);
        if (cabins.response.objects.length > 0) {
          setSelectedCabin(cabins.response.objects[0].id);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [flightCode]);

  const handleSeatSelect = (seatId: number) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else if (prev.length < 10) {
        return [...prev, seatId];
      } else {
        setNotification({
          titulo: dict.CLIENT.FLIGHTS.ERRORS.ERROR_SELECT_SEATS_TITLE,
          mensaje: dict.CLIENT.FLIGHTS.ERRORS.ERROR_SELECT_SEATS_MESSAGE,
          code: 400,
          tipo: "error",
        });
        return prev;
      }
    });
  };

  const removeSeat = (seatId: number) => {
    setSelectedSeats(prev => prev.filter(id => id !== seatId));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-t from-glacier-950 via-zinc-900 to-glacier-900 bg-blend-exclusion">
        <Loader />
      </div>
    );
  }

  if (error || !flightDetails) {
    return <div className="text-white text-center py-20">{dict.CLIENT.FLIGHTS.ERRORS.LOADING_DATA_FLIGHT}</div>;
  }

  const selectedCabinObject = cabins.find(c => c.id === selectedCabin);
  const handleCloseNotification = () => setNotification(null);
  return (
    <div className="text-white px-6 py-10 space-y-12 max-w-[1850px] mx-auto">
      {/* Información del vuelo */}
      <section className="bg-glacier-900/40 border border-glacier-700 rounded-xl p-6 shadow-md">
        <h1 className="text-3xl font-bold text-glacier-200 mb-2">{flightDetails.airline.name}</h1>
        <p className="text-lg mb-2 text-glacier-300">
          {flightDetails.departureAirport.city.name} ({flightDetails.departureAirport.iataCode}) → {flightDetails.arrivalAirport.city.name} ({flightDetails.arrivalAirport.iataCode})
        </p>
        <p className="text-lg mb-4 text-glacier-300">
          {flightDetails.departureAirport.name} → {flightDetails.arrivalAirport.name}
        </p>
        <div className="grid sm:grid-cols-3 gap-6 text-sm text-glacier-100">
          <div>
            <p className="font-semibold">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.DEPATURE}</p>
            <p>{new Date(flightDetails.dateTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.ARRIVAL}</p>
            <p>{new Date(flightDetails.dateTimeArrival).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.STATUS}</p>
            <p>{flightDetails.flightStatus}</p>
          </div>
        </div>
        <div className="border-t border-glacier-700 my-6"></div>
        <p className="text-xl font-semibold text-glacier-200 mb-4">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.DETAILS}</p>
        <div className="grid sm:grid-cols-2 gap-6 text-sm text-glacier-200">
          <div>
            <ul className="space-y-1">
              <li>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.TYPE}: {flightDetails.airplane.airplaneTypeName} ({flightDetails.airplane.model})
              </li>
              <li>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.REGISTRATION}: {flightDetails.airplane.registrationNumber}
              </li>
              <li>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CAPACITY}: {flightDetails.airplane.capacity} {dict.CLIENT.FLIGHTS.FLIGHT_CODE.PASSENGERS}
              </li>
              <li>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.YEAR}: {flightDetails.airplane.yearOfManufacture}
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.MANUFACTURER}</p>
            <p>{flightDetails.airplane.manufacturer}</p>
          </div>
        </div>
      </section>

      {/* Comidas */}
      {meals.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-glacier-100">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.MEALS_AVAILABLE}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals.map((meal, index) => (
              <div key={index} className="border border-glacier-600 rounded-xl p-4 bg-glacier-900/30 shadow-md">
                <h4 className="text-lg font-semibold text-glacier-200">{meal.name}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selección de cabina */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-glacier-100">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CABINS_AVAILABLE}</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {cabins.map(cabin => (
            <div
              key={cabin.id}
              className={`border-2 rounded-xl p-4 transition cursor-pointer ${selectedCabin === cabin.id ? "border-glacier-400 bg-glacier-800/30" : "border-glacier-600 hover:border-glacier-400"}`}
              onClick={() => setSelectedCabin(cabin.id)}>
              <p className="text-lg font-medium">{cabin.seatClass}</p>
              <p>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.PRICE}: <span className="font-semibold">{cabin.price} €</span>
              </p>
              <p>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.SEATS_AVAILABLE}: {cabin.availableSeats}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Selector de asientos */}
      {selectedCabinObject && (
        <section className="space-y-4">
          <div className="flex flex-row flex-start items-center gap-1">
            <h3 className="text-xl font-semibold text-glacier-100 pr-2">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.SELECT_YOUR_SEAT}</h3>
            <p className="text-base text-glacier-300 text-left">({dict.CLIENT.FLIGHTS.FLIGHT_CODE.MAX_SEATS})</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-glacier-400 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-glacier-200 rounded-sm border border-glacier-100" /> {dict.CLIENT.FLIGHTS.FLIGHT_CODE.SELECTED}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-glacier-900 border border-glacier-500" /> {dict.CLIENT.FLIGHTS.FLIGHT_CODE.AVAILABLE}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-zinc-700 border border-zinc-600" /> {dict.CLIENT.FLIGHTS.FLIGHT_CODE.OCCUPIED}
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            {(() => {
              const seatGroups = selectedCabinObject.seatPattern.split(" ").map(group => group.split("-"));
              const rows: { [row: string]: typeof selectedCabinObject.seats } = {};
              selectedCabinObject.seats.forEach(seat => {
                if (!rows[seat.seatRow]) rows[seat.seatRow] = [];
                rows[seat.seatRow].push(seat);
              });
              const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

              return sortedRows.map(row => (
                <div key={row} className="flex gap-2 mb-1 items-center">
                  <span className="w-6 text-right mr-2 text-glacier-300 font-mono">{row}</span>
                  {seatGroups.map((group, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                      {group.map(col => {
                        const seat = rows[row].find(s => s.seatColumn === col);
                        return seat ? (
                          <motion.div
                            layout
                            key={seat.id}
                            className="flex flex-col items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}>
                            <button
                              disabled={!seat.state}
                              onClick={() => handleSeatSelect(seat.id)}
                              className={`w-12 h-12 text-base font-bold rounded-lg border flex items-center justify-center
                              ${
                                !seat.state
                                  ? "bg-zinc-700/40 text-zinc-400 cursor-not-allowed"
                                  : selectedSeats.includes(seat.id)
                                  ? "bg-glacier-200 border-glacier-100 text-zinc-900 shadow-lg"
                                  : "bg-glacier-900 hover:bg-glacier-600 border-glacier-500"
                              }`}
                              title={`Fila ${seat.seatRow}, ${dict.CLIENT.FLIGHTS.FLIGHT_CODE.SEAT} ${seat.seatColumn}`}>
                              {seat.seatColumn}
                            </button>
                          </motion.div>
                        ) : (
                          <span key={col} className="w-12 h-12" />
                        );
                      })}
                      {groupIdx < seatGroups.length - 1 && <span className="w-4" />}
                    </React.Fragment>
                  ))}
                </div>
              ));
            })()}
          </div>
        </section>
      )}

      {/* Botón flotante */}
      {selectedSeats.length > 0 && !showSidebar && (
        <motion.button
          className="fixed bottom-4 left-4 z-50 bg-glacier-950 border border-glacier-300 text-white px-6 py-3 rounded-full shadow-lg font-semibold transition flex items-center gap-2"
          onClick={() => setShowSidebar(true)}
          initial={{ opacity: 0, x: -150, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -150, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <span>{dict.CLIENT.FLIGHTS.FLIGHT_CODE.VIEW_SELECTION}</span>
          <span className="bg-white text-glacier-800 rounded-full px-2 text-sm">{selectedSeats.length}</span>
        </motion.button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full xl:w-[30vw] bg-glacier-950/95 z-50 shadow-2xl flex flex-col justify-between"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.YOUR_SEATS}</h2>
                <button className="text-glacier-300 hover:text-white text-2xl" onClick={() => setShowSidebar(false)} title="Cerrar">
                  <IoCloseSharp className="text-2xl" />
                </button>
              </div>
              <ul className="mb-8 space-y-10">
                {selectedSeats.map(seatId => {
                  const cabin = cabins.find(c => c.seats.some(s => s.id === seatId));
                  const seat = cabin?.seats.find(s => s.id === seatId);
                  return (
                    <li key={seatId} className="flex items-center justify-between gap-6 text-lg">
                      <span className="flex items-center gap-2">
                        {cabin && <span className="mr-2 px-2 py-0.5 rounded bg-glacier-800 text-glacier-200 text-base font-semibold">{cabin.seatClass}</span>}
                        Fila {seat?.seatRow}, {dict.CLIENT.FLIGHTS.FLIGHT_CODE.SEAT} {seat?.seatColumn}
                        {cabin && <span className="ml-2 text-glacier-300 text-base font-semibold">{cabin.price} €</span>}
                      </span>

                      <button className="text-red-400 hover:text-red-600 text-xl" onClick={() => removeSeat(seatId)} title="Eliminar asiento">
                        <IoCloseSharp className="text-xl" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="p-8 border-t border-glacier-700">
              <div className="mb-8">
                <div className="flex justify-between text-lg mb-4">
                  <span>Total:</span>
                  <span className="font-semibold">
                    {selectedSeats
                      .map(seatId => {
                        const cabin = cabins.find(c => c.seats.some(s => s.id === seatId));
                        return cabin?.price || 0;
                      })
                      .reduce((sum, price) => sum + price, 0)
                      .toFixed(2)}{" "}
                    €
                  </span>
                </div>
                <button className="text-sm text-red-400 hover:underline self-start" onClick={() => setSelectedSeats([])}>
                  {dict.CLIENT.FLIGHTS.FLIGHT_CODE.EMPTY_SELECTION}
                </button>
              </div>
              <button
                className="w-full bg-glacier-400 hover:bg-glacier-300 text-glacier-950 font-bold py-3 rounded-xl text-lg transition"
                onClick={() => {
                  if (!token) {
                    router.push("/login");
                    return;
                  }
                  const seatCabinPairs = selectedSeats.map(seatId => {
                    const cabin = cabins.find(c => c.seats.some(s => s.id === seatId));
                    const seat = cabin?.seats.find(s => s.id === seatId);
                    return {
                      seatId,
                      cabinId: cabin?.id,
                      seatRow: seat?.seatRow,
                      seatColumn: seat?.seatColumn,
                      seatClass: cabin?.seatClass,
                      price: cabin?.price,
                    };
                  });

                  const totalPrice = seatCabinPairs.reduce((sum, pair) => sum + (pair.price || 0), 0);
                  const seatCabinParam = encodeURIComponent(JSON.stringify(seatCabinPairs));
                  console.log(`Total Price: ${totalPrice.toFixed(2)} €`);
                  router.push(`/${lang}/flights/${flightCode}/checkout?seats=${seatCabinParam}`);
                }}>
                {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CONTINUE}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
