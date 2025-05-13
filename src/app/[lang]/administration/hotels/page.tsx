"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { HotelVO } from "./types/hotel";
import { getAllHotels } from "./services/hotel.service";
import TableHotels from "./components/TableHotels";

export default function AdminUsersPage() {
  const { dict } = useDictionary();

  const [hotel, setHotels] = useState<HotelVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await getAllHotels(20, page);
      setHotels(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page]);

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

  return (
    <div>
      <h1 className="text-2xl">{dict.ADMINISTRATION.SIDEBAR.HOTELS}</h1>
      <div className="bg-zinc-700 p-10 m-4 rounded-md">
        <TableHotels data={hotel} onRefresh={fetchHotels} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
