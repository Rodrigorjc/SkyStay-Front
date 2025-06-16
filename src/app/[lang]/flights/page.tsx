"use client";
import { useDictionary } from "@/app/context/DictionaryContext";
import React, { useCallback, useEffect, useState, Suspense } from "react";
import { FlightClientVO } from "./types/flight";
import { FlightCard } from "./components/FlightCard";
import { motion } from "framer-motion";
import { RiMoneyEuroCircleFill } from "react-icons/ri";
import { FaCity, FaPlaneUp } from "react-icons/fa6";
import { getAllFlights } from "./services/client.flights.service";
import { useSearchParams } from "next/navigation";
import Loader from "@/app/components/ui/Loader";

// Componente separado para usar useSearchParams dentro de Suspense
function FlightsPageContent() {
  const { dict } = useDictionary();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || null;
  const destination = searchParams.get("destination") || null;
  const [flights, setFlights] = useState<FlightClientVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    airline: "",
    price: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ origin: "", destination: "", airline: "", price: "" });
    setFlights([]);
    setPage(1);
    setHasMore(true);
    setError(false);
    fetchFlights({ reset: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFlights([]);
    setPage(1);
    setHasMore(true);
    setError(false);
    fetchFlights({ filters, reset: true });
  };

  const fetchFlights = useCallback(
    async ({ filters: customFilters = filters, reset = false } = {}) => {
      if (!hasMore && !reset) return;
      setLoading(true);
      try {
        const response = await getAllFlights(50, reset ? 1 : page, {
          origin: customFilters.origin || undefined,
          destination: customFilters.destination || undefined,
          airline: customFilters.airline || undefined,
          price: customFilters.price ? Number(customFilters.price) : undefined,
        });
        setFlights(prev => (reset ? response.objects : [...prev, ...response.objects]));
        setHasMore(response.hasNextPage);
        setPage(response.currentPage + 1);
      } catch (error) {
        console.error("Error fetching flights:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, hasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      if (bottomReached && !loading && hasMore) {
        fetchFlights();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, fetchFlights]);

  useEffect(() => {
    fetchFlights({ reset: true });
  }, [fetchFlights]);

  useEffect(() => {
    if (origin && destination) {
      setFilters(prev => ({
        ...prev,
        origin,
        destination,
      }));
      fetchFlights({ filters: { ...filters, origin, destination }, reset: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination]);

  if (!dict) return null;

  return (
    <div className="py-10 px-4 flex flex-col items-center gap-8">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-gray-200 tracking-tight">{dict.CLIENT.FLIGHTS.NEXT_FLIGHT}</h1>
      </header>
      <motion.div className="w-full max-w-[1850px] mx-auto px-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <h3 className="text-lg font-semibold text-white/80 tracking-wide mb-3">{dict.CLIENT.FLIGHTS.FILTER}</h3>
        <form className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-end mb-2" onSubmit={handleSubmit} onReset={handleReset}>
          {/* Origen */}
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="filter-origin" className="text-sm text-glacier-200 tracking-wide pl-1">
              {dict.CLIENT.FLIGHTS.DEPATURE_CITY}
            </label>
            <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
              <FaCity className="mr-2.5 text-glacier-300" />
              <input
                id="filter-origin"
                name="origin"
                type="text"
                placeholder="Bogotá"
                className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                value={filters.origin}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Destino */}
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="filter-destination" className="text-sm text-glacier-200 tracking-wide pl-1">
              {dict.CLIENT.FLIGHTS.ARRIVAL_CITY}
            </label>
            <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
              <FaCity className="mr-2.5 text-glacier-300" />
              <input
                id="filter-destination"
                name="destination"
                type="text"
                placeholder="Miami"
                className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                value={filters.destination}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Aerolínea */}
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="filter-airline" className="text-sm text-glacier-200 tracking-wide pl-1">
              {dict.CLIENT.FLIGHTS.AIRLINE}
            </label>
            <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
              <FaPlaneUp className="mr-2.5 text-glacier-300" />
              <input
                id="filter-airline"
                name="airline"
                type="text"
                placeholder="Iberia"
                className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                value={filters.airline}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Precio */}
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="filter-price" className="text-sm text-glacier-200 tracking-wide pl-1">
              {dict.CLIENT.FLIGHTS.LOWEST_PRICE} (€)
            </label>
            <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 active:text-white/80">
              <RiMoneyEuroCircleFill className="mr-2.5 text-glacier-300" />
              <input
                id="filter-price"
                name="price"
                type="number"
                min={0}
                placeholder="300"
                className="bg-transparent placeholder-glacier-300 w-full focus:outline-none appearance-none"
                value={filters.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Botones */}
          <div className="sm:col-span-2 md:col-span-4 flex justify-end space-x-4 mt-2">
            <button
              type="reset"
              className="px-5 py-2 rounded-xl border border-glacier-400 text-glacier-200 bg-transparent hover:bg-glacier-500/10 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-glacier-400 shadow-none">
              {dict.CLIENT.FLIGHTS.RESET}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-glacier-500 via-cyan-400/50 to-glacier-400 text-white font-semibold shadow-none hover:from-cyan-400/50 hover:to-glacier-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-300">
              {dict.CLIENT.FLIGHTS.SEARCH}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="border-b-2 border-glacier-400/50 max-w-[1850px] w-full my-4"></div>

      {error && (
        <div className="text-center text-white mt-4 text-3xl w-full flex flex-col items-center">
          <p>{dict.CLIENT.FLIGHTS.ERRORS.ERROR_LOADING}</p>
        </div>
      )}
      <div className="w-full max-w-[1850px] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3  gap-6">
        {flights && flights.length > 0 && flights.map(flight => <FlightCard key={flight.code} flights={[flight]} />)}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <FlightsPageContent />
    </Suspense>
  );
}
