"use client";
import { useEffect, useState } from "react";
import { getAllAirports } from "@services/administration.user.service";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { AirportAdminVO } from "@/types/admin/airport";
import TableAirports from "./components/TableAirports";

export default function AdminUsersPage() {
  const { dict } = useDictionary();

  const [airports, setAirports] = useState<AirportAdminVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllAirports(20, page);
      setAirports(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      <h1 className="text-2xl">{dict.ADMINISTRATION.SIDEBAR.AIRPORTS}</h1>
      <div className="bg-zinc-700 p-10 m-4 rounded-md">
        <TableAirports data={airports} onRefresh={fetchUsers} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
