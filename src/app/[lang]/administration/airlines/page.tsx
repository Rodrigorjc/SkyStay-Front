"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import Button from "@/app/components/ui/Button";
import TableAirline from "./components/TableAirline";
import { AirlineTableVO } from "./types/airline";
import ModalCreateAirline from "./components/ModalCreateAirline";
import { getAllAirlines } from "./services/airline.service";
import { Title } from "../components/Title";

export default function AirlinePage() {
  const { dict } = useDictionary();

  const [airlines, setAirline] = useState<AirlineTableVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreate = () => setIsCreating(true);

  const fetchAirline = async () => {
    setLoading(true);
    try {
      const response = await getAllAirlines(20, page);
      setAirline(response.objects);
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
  };

  useEffect(() => {
    fetchAirline();
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

  const handleCreateSuccess = (notification: Notifications) => {
    setNotification(notification);
    setIsCreating(false);
    fetchAirline();
  };

  return (
    <>
      <Title title={dict.ADMINISTRATION.SIDEBAR.AIRLINES} />
      <div className="p-1 m-4 rounded-mdrounded-md">
        <div className="flex flex-row items-end gap-4">
          <Button text={dict.ADMINISTRATION.AIRLINE.ADD_AIRLINE} onClick={() => handleCreate()} color="admin" className="" />
          <Button text={dict.ADMINISTRATION.RELOAD} onClick={() => fetchAirline()} color="admin" className="" />
        </div>
        <TableAirline data={airlines} onRefresh={fetchAirline} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
      {isCreating && <ModalCreateAirline onClose={() => setIsCreating(false)} onSuccess={handleCreateSuccess} isOpen={false} />}
    </>
  );
}
