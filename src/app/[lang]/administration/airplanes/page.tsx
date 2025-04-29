"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@context";
import { AirplaneShowVO } from "./types/airplane";
import { getAllAirplanes } from "@services/administration.user.service";
import Loader from "@/app/components/ui/Loader";
import TablePlanes from "./components/TableAirplanes";
import Pagination from "@/app/components/ui/Pagination";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function Page() {
  const { dict } = useDictionary();
  const [planes, setPlanes] = useState<AirplaneShowVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [isCreating, setIsCreating] = useState(false);
  const [editingPlane, setEditingPlane] = useState<AirplaneShowVO | null>(null);

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

  const handleEdit = (plane: AirplaneShowVO) => setEditingPlane(plane);

  const handleModalClose = () => {
    setIsCreating(false);
    setEditingPlane(null);
  };

  const handleSuccess = () => {
    fetchPlanes();
    handleModalClose();
  };

  return (
    <div>
      <h1 className="text-2xl">{dict.ADMINISTRATION.AIRPLANES.TITLE}</h1>
      <div className="bg-zinc-700 p-10 m-4 rounded-md">
        <button onClick={handleCreate} className="text-5xl rounded-xl font-semibold transition-all duration-400 hover:scale-110 active:scale-90 text-glacier-400">
          <IoIosAddCircleOutline />
        </button>

        <TablePlanes planes={planes} onEdit={handleEdit} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>

      {/* {isCreating && <PlanesCreateModal onClose={handleModalClose} onSuccess={handleSuccess} />}
      {editingPlane && <PlanesEditModal onClose={handleModalClose} onSuccess={handleSuccess} planeToEdit={editingPlane} />} */}
    </div>
  );
}
