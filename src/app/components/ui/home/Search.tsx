"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../Button";
import { useDictionary } from "@/app/context/DictionaryContext";

const SearchBarHome: React.FC = () => {
  const router = useRouter();

  const { dict } = useDictionary();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState<"flights" | "accommodation">("flights");

  const isFlights = mode === "flights";

  return (
    <section className="w-full max-w-5xl mx-auto px-8 py-8 rounded-2xl bg-glacier-700/40 backdrop-blur-md border border-white/20 text-white shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-center sm:text-left pl-0.5">{isFlights ? dict.HOME.SEARCH_BAR.IDEAL_FLIGHT : dict.HOME.SEARCH_BAR.PERFECT_ACCOMMODATION}</h2>
        <div className="flex gap-4 justify-center">
          <button
            className={`px-5 py-2 rounded-full font-semibold border transition-all text-sm sm:text-base ${
              isFlights ? "bg-white/10 border-white/30 text-white shadow-inner" : "hover:bg-white/10 border-white/20 text-white/70"
            }`}
            onClick={() => setMode("flights")}>
            {dict.HOME.SEARCH_BAR.FLIGHTS}
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold border transition-all text-sm sm:text-base ${
              !isFlights ? "bg-white/10 border-white/30 text-white shadow-inner" : "hover:bg-white/10 border-white/20 text-white/70"
            }`}
            onClick={() => setMode("accommodation")}>
            {dict.HOME.SEARCH_BAR.ACCOMMODATION}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none"
          placeholder={isFlights ? dict.HOME.SEARCH_BAR.ORIGIN : dict.HOME.SEARCH_BAR.CITY_HOTEL_OR_APPARTMENT}
          value={origin}
          onChange={e => setOrigin(e.target.value)}
        />
        <input
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none"
          placeholder={isFlights ? dict.HOME.SEARCH_BAR.DESTINATION : dict.HOME.SEARCH_BAR.DATE_OF_ARRIVAL}
          value={destination}
          onChange={e => setDestination(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <Button
          text={isFlights ? dict.HOME.SEARCH_BAR.SEARCH_FLIGHTS : dict.HOME.SEARCH_BAR.SEARCH_ACCOMMODATION}
          color="light"
          className="bg-glacier-500/70 hover:bg-glacier-500 text-white px-6 py-3 rounded-full border border-white/10"
          onClick={() => router.push(isFlights ? "/flights" : "/accomodations")}
        />
      </div>
    </section>
  );
};

export default SearchBarHome;
