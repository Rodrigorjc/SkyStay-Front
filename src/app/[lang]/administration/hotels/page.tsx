"use client";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { HotelVO } from "./types/hotel";
import { getAllHotels } from "./services/hotel.service";
import TableHotels from "./components/TableHotels";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Title } from "../components/Title";

export default function AdminUsersPage() {
  const { dict } = useDictionary();
  const [hotel, setHotels] = useState<HotelVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllHotels(20, page);
      setHotels(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      return (
        <div className="flex items-center justify-center min-h-screen w-full">
          <h1 className="text-2xl">{dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE}</h1>
        </div>
      );
    } finally {
      setLoading(false);
    }
  }, [page, dict]);

  useEffect(() => {
    fetchHotels();
  }, [page, fetchHotels]);

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

  if (!dict) return null;
  return (
    <div>
      <Title title={dict.ADMINISTRATION.SIDEBAR.HOTELS} />
      <div className="p-1 m-4">
        <TableHotels data={hotel} onRefresh={fetchHotels} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
