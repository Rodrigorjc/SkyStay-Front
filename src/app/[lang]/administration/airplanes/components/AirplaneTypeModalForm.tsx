"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useDictionary } from "@context";
import { createAirplaneType } from "../services/airplane.service";
import { CreateAirplanesTypesFormVO } from "../types/airplane";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AirplaneTypeFormAdd({ onClose, onSuccess }: Props) {
  const { dict } = useDictionary();
  const [formData, setFormData] = useState<CreateAirplanesTypesFormVO>({
    name: "",
    manufacturer: "",
    capacity: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAirplaneType(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear un tipo de avion:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
      <div className="bg-zinc-800 p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all" aria-label="Cerrar modal">
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">{dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE_TYPE}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 text-base">
          {/* Código del avión */}
          <div className="col-span-2 flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.AIRPLANES_CODE}</label>
              <IoInformationCircleOutline className="text-lg" title={dict.ADMINISTRATION.AIRPORTS.CODE_EXPLANATION} />
            </div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={dict.ADMINISTRATION.AIRPORTS.CODE_EXPLANATION}
              className="border border-glacier-500 p-2.5 rounded-xl transition"
              required
            />
          </div>

          {/* Capacidad */}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.CAPACITY}</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder={dict.ADMINISTRATION.AIRPLANES.CAPACITY}
              className="border border-glacier-500 p-2.5 rounded-xl transition"
              required
              min={1}
            />
          </div>

          {/* Fabricante */}
          <div className="col-span-4 flex flex-col gap-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}</label>
            <input
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder={dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}
              className="border border-glacier-500 p-2.5 rounded-xl transition"
              required
            />
          </div>

          {/* Botones */}
          <div className="col-span-4 flex space-x-4 mt-4">
            <button type="submit" className="flex-1 px-4 py-2 bg-glacier-500 active:bg-glacier-600 rounded-xl font-semibold transition-all duration-400 hover:scale-105 active:scale-95">
              {dict.ADMINISTRATION.SAVE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
