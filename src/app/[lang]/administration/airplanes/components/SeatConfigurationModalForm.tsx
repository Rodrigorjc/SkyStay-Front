import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDictionary } from "@context";
import { CreateSeatConfigurationVO } from "../types/airplane";
import { createSeatConfiguration, getAllAirplanesSeatClases } from "@/lib/services/administration.user.service";
import { IoInformationCircleOutline } from "react-icons/io5";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SeatConfigurationModalForm({ onClose, onSuccess }: Props) {
  const { dict } = useDictionary();

  const [formData, setFormData] = useState<CreateSeatConfigurationVO>({
    seatPattern: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "totalRows" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSeatConfiguration(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al crear la configuracion de asientos:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
      <div className="bg-zinc-800 p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all" aria-label="Cerrar modal">
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">{dict.ADMINISTRATION.AIRPLANES.ADD_SEAT_CONFIGURATION}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-base">
          {/* Patrón de los asientos */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-2 mb-1">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.SEAT_PATTERN}</label>
              <IoInformationCircleOutline className="text-lg" title="A-B C-D E-F | A-B-C D-E-F" />
            </div>
            <input
              type="text"
              name="seatPattern"
              value={formData.seatPattern}
              onChange={handleChange}
              placeholder={dict.ADMINISTRATION.AIRPLANES.SEAT_PATTERN}
              className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800"
              required
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1 col-span-1">
            <label className="text-sm font-medium">{dict.ADMINISTRATION.DESCRIPTION}</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={dict.ADMINISTRATION.DESCRIPTION}
              className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800"
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex space-x-4 mt-4">
            <button type="submit" className="flex-1 px-4 py-2 bg-glacier-500 active:bg-glacier-600 rounded-xl font-semibold transition-all duration-400 hover:scale-105 active:scale-95">
              {dict.ADMINISTRATION.SAVE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
