"use client";

import React from "react";
import { Cabin, Seat } from "../types/airplane.info";
import { useDictionary } from "@/app/context/DictionaryContext";

const groupSeatsByRow = (seats: Seat[]) => {
  const grouped: Record<string, Seat[]> = {};
  seats.forEach(seat => {
    if (!grouped[seat.seatRow]) grouped[seat.seatRow] = [];
    grouped[seat.seatRow].push(seat);
  });
  return grouped;
};

const AirplaneCabins: React.FC<{ cabins: Cabin[] }> = ({ cabins }) => {
  const { dict } = useDictionary();

  return (
    <div className="my-8 flex flex-row items-start justify-center overflow-x-auto gap-12 px-6 text-zinc-100 scrollbar-thin scrollbar-thumb-cyan-500 ">
      {cabins.map(cabin => {
        const rows = groupSeatsByRow(cabin.seats);
        const seatGroups = cabin.seatconfigurationName.split(" "); // Ej: "ABC DEF"

        return (
          <div
            key={cabin.cabinId}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-glacier-500/30 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[560px] sm:min-w-32 hover:border-glacier-400 transition-all duration-300">
            {/* Título de la clase */}
            <h2 className="text-xl font-semibold text-glacier-400 border-b border-glacier-700 pb-2 uppercase tracking-wide">Clase: {cabin.seatClass}</h2>

            {/* Leyenda de asientos */}
            <div className="flex items-center justify-between gap-4 mb-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-400 rounded shadow-inner" />
                <span>{dict.ADMINISTRATION.AIRPLANES.FREE}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded shadow-inner" />
                <span>{dict.ADMINISTRATION.AIRPLANES.OCCUPIED}</span>
              </div>
            </div>

            {/* Representación de asientos */}
            <div className="flex flex-col gap-3 items-center justify-center">
              {Object.entries(rows)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([row, seats]) => (
                  <div key={row} className="flex items-center gap-3">
                    {/* Número de fila */}
                    <span className="text-glacier-300 font-mono w-6 text-sm">{row}</span>

                    {/* Asientos por grupo (horizontal con pasillo) */}
                    <div className="flex flex-row gap-6">
                      {seatGroups.map((group, index) => {
                        const groupPattern = group.split("-");
                        const groupSeats = seats.filter(seat => groupPattern.includes(seat.seatColumn)).sort((a, b) => a.seatColumn.localeCompare(b.seatColumn));

                        return (
                          <div key={index} className="flex flex-row gap-2">
                            {groupPattern.map(column => {
                              const seat = groupSeats.find(s => s.seatColumn === column);
                              return (
                                <div
                                  key={column}
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-200
                                    ${seat?.state ? "bg-green-400 text-black hover:brightness-110" : "bg-red-500 text-white hover:brightness-110"}`}>
                                  {column}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AirplaneCabins;
