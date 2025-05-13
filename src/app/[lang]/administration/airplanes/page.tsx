"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@context";
import { AirplaneShowVO } from "./types/airplane";
import Loader from "@/app/components/ui/Loader";
import TablePlanes from "./components/TableAirplanes";
import Pagination from "@/app/components/ui/Pagination";
import AirplaneModalForm from "./components/AirplanesFormAdd";
import AirplaneTypeModalForm from "./components/AirplaneTypeModalForm";
import CabinDetailsModalForm from "./components/SeatConfigurationModalForm";

import { FaPlane, FaPlus, FaThLarge } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import { getAllAirplanes } from "./services/airplane.service";

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
        <div className="flex flex-row justify-start items-center mb-4 gap-4">
          <Button text={dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANES} onClick={() => handleCreate()} color="admin" className="" />
          <Button text={dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE_TYPE} onClick={() => handleCreateAirplaneType()} color="admin" className="" />
          <Button text={dict.ADMINISTRATION.AIRPLANES.ADD_SEAT_CONFIGURATION} onClick={() => handleCreateCabinDetails()} color="admin" className="" />
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
