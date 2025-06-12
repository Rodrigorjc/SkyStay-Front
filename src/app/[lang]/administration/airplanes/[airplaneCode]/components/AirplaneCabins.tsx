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
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-glacier-500/30 rounded-2xl px-8 pb-8 shadow-2xl flex flex-col gap-6 min-w-[560px] sm:min-w-32 hover:border-glacier-400 transition-all duration-300 max-h-[600px] overflow-y-auto scroll">
            <h2 className="pt-4 sticky top-0 z-10 -mx-8 px-8 text-xl font-semibold text-glacier-400 border-b border-glacier-700 pb-2 uppercase tracking-wide text-center bg-zinc-900 bg-clip-padding">
              {dict.ADMINISTRATION.CLASS}: {cabin.seatClass}
            </h2>

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
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono transition-all duration-200 hover:brightness-110 bg-glacier-400`}>
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
