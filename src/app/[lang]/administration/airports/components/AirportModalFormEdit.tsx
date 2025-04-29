"use client";

import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDictionary } from "@context";
import LocationSelector from "@/app/components/ui/MapSelector";
import { Coordinates } from "@/types/common/coordinates";
import { updateAirport, getAllCities } from "@/lib/services/administration.user.service";
import { CityVO } from "@/types/admin/city";
import { AirportFormEdit } from "@/types/admin/form";

interface Props {
  onClose: () => void;
  defaultValues: AirportFormEdit;
}

export default function AirportModalFormEdit({ onClose, defaultValues }: Props) {
  const { dict } = useDictionary();
  const apiKey = process.env.NEXT_PUBLIC_TIMEZONE_API_KEY || "";

  const [formData, setFormData] = useState<AirportFormEdit>(defaultValues);
  const [cities, setCities] = useState<CityVO[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAirport(formData);
      console.log("Airport updated:", formData);
      onClose();
    } catch (error) {
      console.error("Error updating airport:", error);
    }
  };

  const handleLocationChange = async ({ lat, lng }: Coordinates) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    try {
      const res = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data?.zoneName) {
        setFormData(prev => ({
          ...prev,
          timezone: data.zoneName,
        }));
      }
    } catch (err) {
      console.error("Error fetching timezone:", err);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getAllCities();
        setCities(response);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
      <div className="bg-zinc-800 p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 transition" aria-label="Cerrar modal">
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">{dict.ADMINISTRATION.AIRPORTS.EDIT_AIRPORT}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 text-base">
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.USERS.NAME}</label>
            <input name="name" value={formData.name} onChange={handleChange} className="border border-glacier-500 p-2.5 rounded-xl transition" required />
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.IATA_CODE}</label>
            <input name="iataCode" value={formData.iataCode} disabled className="border border-glacier-500 p-2.5 rounded-xl transition bg-zinc-700 text-gray-300" />
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.DESCRIPTION}</label>
            <input name="description" value={formData.description} onChange={handleChange} maxLength={255} className="border border-glacier-500 p-2.5 rounded-xl transition" required />
          </div>

          <div className="col-span-1 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.TERMINAL}</label>
            <input name="terminal" value={formData.terminal} onChange={handleChange} className="border border-glacier-500 p-2.5 rounded-xl transition" required />
          </div>

          <div className="col-span-1 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.GATE}</label>
            <input name="gate" value={formData.gate} onChange={handleChange} className="border border-glacier-500 p-2.5 rounded-xl transition" required />
          </div>

          <div className="col-span-4 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.CITY}</label>
            <select name="city" value={formData.city} onChange={handleChange} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800" required>
              <option value="" disabled>
                {dict.ADMINISTRATION.AIRPORTS.SELECT_CITY}
              </option>
              {cities
                .filter((city: CityVO) => city.name && city.name.trim() !== "")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((city: CityVO) => (
                  <option key={city.name} value={city.name}>
                    {city.name}, {city.country.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-span-4 flex flex-col gap-1">
            <LocationSelector onChange={handleLocationChange} />
          </div>

          <div className="col-span-1 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.LATITUDE}</label>
            <input name="latitude" value={formData.latitude} disabled className="border border-glacier-500 p-2.5 rounded-xl transition" />
          </div>

          <div className="col-span-1 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.LONGITUDE}</label>
            <input name="longitude" value={formData.longitude} disabled className="border border-glacier-500 p-2.5 rounded-xl transition" />
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPORTS.TIMEZONE}</label>
            <input name="timezone" value={formData.timezone} disabled className="border border-glacier-500 p-2.5 rounded-xl transition" />
          </div>

          <button
            type="submit"
            className="mt-2 col-span-4 px-2 py-2 rounded-xl font-semibold transition-all duration-400 hover:scale-105 active:scale-95 bg-glacier-500 text-white active:bg-glacier-600">
            {dict.ADMINISTRATION.SAVE}
          </button>
        </form>
      </div>
    </div>
  );
}
