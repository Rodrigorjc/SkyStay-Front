"use client";

import { useDictionary } from "@context";
import { AirportAdminVO } from "@/types/admin/airport";
import { IoIosAddCircleOutline } from "react-icons/io";
import AirportModalForm from "./AirportModalForm";
import AirportModalFormEdit from "./AirportModalFormEdit";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { AirportForm, AirportFormEdit } from "@/types/admin/form";
import { IoRefresh } from "react-icons/io5";

interface AdminAirportsTableProps {
  data: AirportAdminVO[];
  onRefresh: () => void;
}

export default function AdminAirportsTable({ data, onRefresh }: AdminAirportsTableProps) {
  const { dict } = useDictionary();
  const [selectedAirport, setSelectedAirport] = useState<AirportFormEdit | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      {isCreateModalOpen && <AirportModalForm onClose={() => setIsCreateModalOpen(false)} />}

      {selectedAirport && <AirportModalFormEdit defaultValues={selectedAirport} onClose={() => setSelectedAirport(null)} />}

      <section>
        <div className="flex flex-row items-end gap-4">
          <button
            className="text-5xl rounded-xl font-semibold transition-all duration-400 hover:scale-110 active:scale-90 text-glacier-400"
            onClick={() => {
              setSelectedAirport(null);
              setIsCreateModalOpen(true);
            }}>
            <IoIosAddCircleOutline />
          </button>
          <button
            className="text-5xl rounded-xl font-semibold transition-all duration-400 hover:scale-110 active:scale-90 text-glacier-400 active:animate-spin active:delay-300"
            onClick={() => {
              onRefresh();
            }}>
            <IoRefresh />
          </button>
        </div>
        <div className="mt-4 overflow-auto">
          <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="text-bold text-justify text-base">
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.DETAILS.CODE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.NAME}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.DESCRIPTION}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.TERMINAL}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.GATE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.LATITUDE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.LONGITUDE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.TIMEZONE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.COUNTRY}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.AIRPORTS.CITY}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.EDIT}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.code} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{d.code}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.name}</td>
                  <td className="border border-gray-300 px-4 py-2 truncate max-w-sm" title={d.description}>
                    {d.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{d.terminal}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.gate}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.latitude}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.longitude}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.timezone}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.city.country.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.city.name}</td>
                  <td className="border border-gray-300 px-4 py-2 ">
                    <Button
                      text={dict.ADMINISTRATION.EDIT}
                      onClick={e => {
                        e.preventDefault();
                        setIsCreateModalOpen(false);
                        setSelectedAirport({
                          code: d.code,
                          name: d.name,
                          iataCode: d.iataCode,
                          description: d.description,
                          terminal: d.terminal,
                          gate: d.gate,
                          latitude: d.latitude,
                          longitude: d.longitude,
                          timezone: d.timezone,
                          city: d.city.name,
                        });
                      }}
                      color="light"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
