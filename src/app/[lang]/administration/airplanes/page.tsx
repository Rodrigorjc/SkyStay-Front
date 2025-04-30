"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@context";
import { AirplaneShowVO } from "./types/airplane";
import { getAllAirplanes } from "@services/administration.user.service";
import Loader from "@/app/components/ui/Loader";
import TablePlanes from "./components/TableAirplanes";
import Pagination from "@/app/components/ui/Pagination";
import AirplaneModalForm from "./components/AirplanesFormAdd";
import AirplaneTypeModalForm from "./components/AirplaneTypeModalForm";
import CabinDetailsModalForm from "./components/SeatConfigurationModalForm";

import { FaPlane, FaPlus, FaThLarge } from "react-icons/fa";

export default function Page() {
  const { dict } = useDictionary();
  const [planes, setPlanes] = useState<AirplaneShowVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingAirplaneType, setIsCreatingAirplaneType] = useState(false);
  const [isCreatingCabinDetails, setIsCreatingCabinDetails] = useState(false);

  const fetchPlanes = async () => {
    setLoading(true);
    try {
      const response = await getAllAirplanes(20, page);
      setPlanes(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loader />
      </div>
    );
  }

  const handleCreate = () => setIsCreating(true);
  const handleCreateAirplaneType = () => setIsCreatingAirplaneType(true);
  const handleCreateCabinDetails = () => setIsCreatingCabinDetails(true);

  const handleModalClose = () => {
    setIsCreating(false);
    setIsCreatingAirplaneType(false);
    setIsCreatingCabinDetails(false);
  };

  const handleSuccess = () => {
    fetchPlanes();
    handleModalClose();
  };

  return (
    <div>
      <h1 className="text-2xl">{dict.ADMINISTRATION.AIRPLANES.TITLE}</h1>
      <div className="bg-zinc-700 p-10 m-4 rounded-md">
        <div className="relative group inline-flex items-center">
          {/* Botón principal a la izquierda */}
          <button
            onClick={handleCreate}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-glacier-500 text-white hover:bg-glacier-600 transition-all"
            title={dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANES}>
            <FaPlane />
          </button>

          {/* Botones secundarios que aparecen a la derecha en hover */}
          <div className="flex space-x-3 ml-3 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleCreateAirplaneType}
              className="flex items-center gap-2 text-base rounded-xl bg-glacier-400 px-4 py-3 font-semibold text-white hover:bg-glacier-500 transition-all"
              title={dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE_TYPE}>
              <FaPlus />
              {dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE_TYPE}
            </button>

            <button
              onClick={handleCreateCabinDetails}
              className="flex items-center gap-2 text-base rounded-xl bg-glacier-400 px-4 py-2.5 font-semibold text-white hover:bg-glacier-500 transition-all"
              title={dict.ADMINISTRATION.AIRPLANES.ADD_SEAT_CONFIGURATION}>
              <FaThLarge />
              {dict.ADMINISTRATION.AIRPLANES.ADD_SEAT_CONFIGURATION}
            </button>
          </div>
        </div>

        <TablePlanes planes={planes} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>

      {isCreating && <AirplaneModalForm onClose={handleModalClose} onSuccess={handleSuccess} />}
      {isCreatingAirplaneType && <AirplaneTypeModalForm onClose={handleModalClose} onSuccess={handleSuccess} />}
      {isCreatingCabinDetails && <CabinDetailsModalForm onClose={handleModalClose} onSuccess={handleSuccess} />}
    </div>
  );
}
