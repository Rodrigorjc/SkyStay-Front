"use client";

import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDictionary } from "@context";
import {
  createAirplanePart1,
  createAirplanePart2,
  getAllAirplanesSeatClases,
  getAllAirplanesStatus,
  getAllAirplanesTypes,
  getAllAirplanesTypesEmun,
  getAllSeatConfigurations,
} from "../services/airplane.service";
import { AirplaneForm1VO, AirplaneForm2VO, AirplanesTypesFormVO, SeatConfigurationVO } from "../types/airplane";
import { IoInformationCircleOutline } from "react-icons/io5";
import Loader from "@/app/components/ui/Loader";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AirplaneModalForm({ onClose }: Props) {
  const { dict } = useDictionary();

  // Nº de paso de inicio
  const [step, setStep] = useState<number>(1);

  const [formData, setFormData] = useState<AirplaneForm1VO>({
    airplane_type_id: 0,
    model: "",
    registrationNumber: "",
    yearOfManufacture: 0,
    status: "",
    type: "",
  });

  const [airplaneTypesEnum, setAirplaneTypesEnum] = useState<[string]>();
  const [airplaneStatuses, setAirplaneStatuses] = useState<[string]>();

  // DATOS PARA LAS TABLAS EN EL APARTADO 1 y 2 DEL FORMULARIO
  const [airplaneTypes, setAirplaneTypes] = useState<[AirplanesTypesFormVO]>();
  const [seatConfiguration, setSeatConfiguration] = useState<[SeatConfigurationVO]>();

  const [idAirplane, setAirplaneId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [numberOfCabins, setNumberOfCabins] = useState<number>(1);
  const [cabinsData, setCabinsData] = useState<AirplaneForm2VO[]>([]);

  const [selectedAirplaneType, setSelectedAirplaneType] = useState<number | null>(null);
  const [selectedSeatConfigurations, setSelectedSeatConfigurations] = useState<number[]>([]);
  const [airplaneSeatClasses, setAirplaneSeatClasses] = useState<string[]>([]);

  const [capacity, setCapacity] = useState<number>(0);
  const [remainingSeats, setRemainingSeats] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const typesResponse = await getAllAirplanesTypesEmun();
        const statusesResponse = await getAllAirplanesStatus();
        const airplaneTypes = await getAllAirplanesTypes();
        const seatConfigurationResponse = await getAllSeatConfigurations();

        setAirplaneTypesEnum(typesResponse.response.objects);
        setAirplaneStatuses(statusesResponse.response.objects);
        setAirplaneTypes(airplaneTypes.response.objects);
        setSeatConfiguration(seatConfigurationResponse.response.objects);
      } catch (error) {
        console.error("Error al obtener todos los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await createAirplanePart1(formData);
      setAirplaneId(data.response.objects);
      setStep(2);
    } catch (error) {
      console.error("Error creating Airplane:", error);
    }
  };

  useEffect(() => {
    setCabinsData([
      {
        airplane_id: idAirplane,
        seat_configuration_id: 0,
        seat_class: "",
        rowStart: 0,
        rowEnd: 0,
      },
    ]);
  }, []);

  const handleNumberOfCabinsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfCabins(value);

    setCabinsData(
      Array.from({ length: value }, () => ({
        airplane_id: idAirplane,
        seat_configuration_id: 0,
        airplane_cabin_id: 0,
        seat_class: "",
        rowStart: 0,
        rowEnd: 0,
      }))
    );

    setSelectedSeatConfigurations(Array(value).fill(null));
  };

  const handleAirplaneTypeSelection = (index: number, type: any) => {
    setSelectedAirplaneType(index);
    setFormData(prev => ({
      ...prev,
      airplane_type_id: type.id,
    }));
    setCapacity(type.capacity);
  };

  useEffect(() => {
    const totalAssignedSeats = cabinsData.reduce((sum, cabin) => {
      const rowStart = cabin.rowStart || 0;
      const rowEnd = cabin.rowEnd || 0;

      // Validar que rowStart y rowEnd sean válidos
      if (rowStart <= 0 || rowEnd <= 0 || rowEnd < rowStart) {
        return sum; // Ignorar esta cabina si los valores no son válidos
      }

      const rows = rowEnd - rowStart + 1;
      const seatPattern = seatConfiguration?.find(config => config.id === cabin.seat_configuration_id)?.seatPattern;

      // Calcular asientos por fila
      const seatsPerRow = seatPattern ? getSeatsPerRow(seatPattern) : 0;

      // Sumar al total solo si los valores son válidos
      return sum + (rows > 0 ? rows * seatsPerRow : 0);
    }, 0);

    setRemainingSeats(capacity - totalAssignedSeats);
  }, [cabinsData, capacity, seatConfiguration]);

  const handleSeatConfigurationSelection = (cabinIndex: number, configIndex: number, config: any) => {
    setSelectedSeatConfigurations(prev => {
      const updatedSelections = [...prev];
      updatedSelections[cabinIndex] = configIndex;
      return updatedSelections;
    });

    setCabinsData(prev => {
      const updatedCabins = [...prev];
      updatedCabins[cabinIndex] = {
        ...updatedCabins[cabinIndex],
        seat_configuration_id: config.id,
      };
      return updatedCabins;
    });
  };

  const handleCabinDataChange = (index: number, field: string, value: any) => {
    const updatedCabins = [...cabinsData];
    updatedCabins[index] = { ...updatedCabins[index], [field]: value };

    const totalAssignedSeats = updatedCabins.reduce((sum, cabin) => {
      const rows = cabin.rowEnd - cabin.rowStart + 1;
      const seatPattern = seatConfiguration?.find(config => config.id === cabin.seat_configuration_id)?.seatPattern;

      const seatsPerRow = seatPattern ? getSeatsPerRow(seatPattern) : 0;
      return sum + (rows > 0 ? rows * seatsPerRow : 0);
    }, 0);

    if (totalAssignedSeats <= capacity) {
      setCabinsData(updatedCabins);
    } else {
      alert(dict.ADMINISTRATION.AIRPLANES.EXCEEDS_CAPACITY);
    }
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Envía solo los datos necesarios
      const formattedCabinsData = cabinsData.map(cabin => ({
        airplane_id: idAirplane,
        seat_configuration_id: cabin.seat_configuration_id,
        seat_class: cabin.seat_class,
        rowStart: cabin.rowStart,
        rowEnd: cabin.rowEnd,
      }));

      console.log("Cabins Data:", formattedCabinsData);
      await createAirplanePart2(formattedCabinsData);
    } catch (error) {
      console.error("Error creating Airplane:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seatClassesResponse = await getAllAirplanesSeatClases();
        setAirplaneSeatClasses(seatClassesResponse.response.objects);
      } catch (error) {
        console.error("Error fetching airplane types or statuses:", error);
      }
    };
    fetchData();
  }, []);

  // Función para calcular el número de asientos por fila
  const getSeatsPerRow = (seatPattern: string): number => {
    return (seatPattern.match(/[A-Z]/g) || []).length;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmitStep1} className="grid grid-cols-4 gap-4 text-base">
            <div className="col-span-4 flex flex-col">
              <h1 className="text-xl font-medium">{dict.ADMINISTRATION.AIRPLANES.AIRPLANE_TYPE}</h1>
            </div>

            <table className="col-span-4 table-auto border-collapse border border-glacier-500 w-full text-white max-h-[50vh] overflow-y-auto">
              <thead>
                <tr>
                  <th className="border border-glacier-500 px-4 py-2">{dict.ADMINISTRATION.AIRPLANES.AIRPLANES_CODE}</th>
                  <th className="border border-glacier-500 px-4 py-2">{dict.ADMINISTRATION.AIRPLANES.CAPACITY}</th>
                  <th className="border border-glacier-500 px-4 py-2">{dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}</th>
                </tr>
              </thead>
              <tbody>
                {airplaneTypes?.map((type, index) => (
                  <tr
                    key={type.id}
                    className={`cursor-pointer ${selectedAirplaneType === index ? "bg-glacier-500 text-white" : "hover:bg-glacier-700"}`}
                    onClick={() => handleAirplaneTypeSelection(index, type)}>
                    <td className="border border-glacier-500 px-4 py-2">{type.name}</td>
                    <td className="border border-glacier-500 px-4 py-2">{type.capacity}</td>
                    <td className="border border-glacier-500 px-4 py-2">{type.manufacturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="col-span-4 flex flex-col">
              <h1 className="text-xl font-medium">{dict.ADMINISTRATION.AIRPLANES.AIRPLANE}</h1>
            </div>

            {/* Modelo del avión (compañia) */}
            <div className="col-span-4 flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.MODEL}</label>
                <IoInformationCircleOutline className="text-lg" title={dict.ADMINISTRATION.AIRPORTS.MODEL_EXPLANATION} />
              </div>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder={dict.ADMINISTRATION.AIRPLANES.MODEL}
                className="border border-glacier-500 p-2.5 rounded-xl transition"
                required
              />
            </div>

            {/* Número de Registro */}
            <div className="col-span-2 flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}</label>
                <IoInformationCircleOutline className="text-lg" title={dict.ADMINISTRATION.AIRPORTS.REGISTRATION_NUMBER_EXPLANATION} />
              </div>
              <label className="text-sm font-medium"></label>
              <input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder={dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}
                className="border border-glacier-500 p-2.5 rounded-xl transition"
                required
              />
            </div>

            {/* Año de Fabricación */}
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}</label>
              <input
                type="number"
                name="yearOfManufacture"
                value={formData.yearOfManufacture}
                onChange={handleChange}
                placeholder={dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}
                className="border border-glacier-500 p-2.5 rounded-xl transition"
                required
              />
            </div>

            {/* Estado */}
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.STATUS}</label>
              <select name="status" value={formData.status} onChange={handleChange} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800" required>
                <option value="" disabled>
                  {dict.ADMINISTRATION.STATUS}
                </option>
                {airplaneStatuses?.map((status: string) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Avión */}
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.TYPE}</label>
              <select name="type" value={formData.type} onChange={handleChange} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800" required>
                <option value="" disabled>
                  {dict.ADMINISTRATION.TYPE}
                </option>
                {airplaneTypesEnum?.map((type: string) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 col-span-4 px-2 py-2 rounded-xl font-semibold transition-all duration-400 hover:scale-105 active:scale-95 bg-glacier-500 text-white active:bg-glacier-600">
              {dict.ADMINISTRATION.NEXT}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleSubmitStep2} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.REMAINING_SEATS}</label>
              <div className="text-lg font-semibold text-glacier-500">
                {dict.ADMINISTRATION.AIRPLANES.SEATS_REMAINING}: {remainingSeats}
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.NUMBER_OF_CABINS}</label>
              <select value={numberOfCabins} onChange={e => handleNumberOfCabinsChange(e)} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800" required>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {cabinsData.map((cabin, index) => (
              <div key={index} className="border-b-2 border-transparent">
                <div className="col-span-2 flex flex-col my-2">
                  <h1 className="text-xl font-medium">
                    {dict.ADMINISTRATION.AIRPLANES.AIRPLANE_CABIN}: {index + 1}
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Numero de inicio de fila */}
                  <div className=" flex flex-col gap-1">
                    <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.ROW_START}</label>
                    <input
                      type="number"
                      placeholder={dict.ADMINISTRATION.AIRPLANES.ROW_START}
                      value={cabin.rowStart || ""}
                      onChange={e => handleCabinDataChange(index, "rowStart", parseInt(e.target.value, 10) || "")}
                      className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800"
                    />
                  </div>

                  {/* Numero de final de fila */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.ROW_END}</label>
                    <input
                      type="number"
                      placeholder={dict.ADMINISTRATION.AIRPLANES.ROW_END}
                      value={cabin.rowEnd || ""}
                      onChange={e => handleCabinDataChange(index, "rowEnd", parseInt(e.target.value, 10) || "")}
                      className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800"
                    />
                  </div>

                  {/* Tipos de asientos de la cabina */}
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.SEAT_CLASS}</label>
                    <select
                      name="seatClass"
                      value={cabin.seat_class}
                      onChange={e => handleCabinDataChange(index, "seat_class", e.target.value)}
                      className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800"
                      required>
                      <option value="" disabled>
                        {dict.ADMINISTRATION.AIRPLANES.SEAT_CLASS}
                      </option>
                      {airplaneSeatClasses.map(seatClass => (
                        <option key={seatClass} value={seatClass}>
                          {seatClass}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-2 flex flex-col text-xl font-medium gap-4 my-4">{dict.ADMINISTRATION.AIRPLANES.SEAT_CONFIGURATION}</div>
                <div>
                  <table className="table-auto border-collapse border border-glacier-500 w-full text-white max-h-[50vh] overflow-y-auto">
                    <thead>
                      <tr>
                        <th className="border border-glacier-500 px-4 py-2">{dict.ADMINISTRATION.AIRPLANES.SEAT_PATTERN}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seatConfiguration?.map((config, configIndex) => (
                        <tr
                          key={config.id}
                          className={`cursor-pointer ${selectedSeatConfigurations[index] === configIndex ? "bg-glacier-500 text-white" : "hover:bg-glacier-700"}`}
                          onClick={() => handleSeatConfigurationSelection(index, configIndex, config)}>
                          <td className="border border-glacier-500 px-4 py-2">{config.seatPattern}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="flex space-x-4 w-full mt-4">
              {/* Botón SIGUIENTE */}
              <button type="submit" className="flex-1 px-4 py-2 bg-glacier-500 active:bg-glacier-600 rounded-xl font-semibold transition-all duration-400 hover:scale-105 active:scale-95">
                {dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANES}
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
      <div className="bg-zinc-800 p-8 rounded-3xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-105 active:scale-95 transition-all" aria-label="Cerrar modal">
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">{dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANES}</h2>
            {/* Barra de pasos */}
            <div className="flex justify-between items-center mx-6 mb-6 relative">
              {["1", "2"].map((stepLabel, index) => (
                <div key={index} className="relative flex items-center">
                  <div className={`flex text-center px-4 py-2 rounded-full transition ${step > index ? "bg-glacier-400 text-white" : "bg-gray-700 text-gray-300"}`}>{stepLabel}</div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-3 text-center">{dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE}</h2>

            {renderStepContent()}
          </div>
        )}
      </div>
    </div>
  );
}
