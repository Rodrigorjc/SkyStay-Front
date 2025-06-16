"use client";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { HotelVO } from "../hotels/types/hotel";
import { getAllApartments } from "./services/apartment.service";
import TableApartments from "./components/TableApartments";
import { Title } from "../components/Title";

export default function AdminApartmentsPage() {
  const { dict } = useDictionary();

  const [hotel, setHotels] = useState<HotelVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllApartments(20, page);
      setHotels(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchApartments();
  }, [page, fetchApartments]);

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
      <Title title={dict.ADMINISTRATION.SIDEBAR.APARTMENTS} />
      <div className="p-1 m-4">
        <TableApartments data={hotel} onRefresh={fetchApartments} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
