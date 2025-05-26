"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import Button from "@/app/components/ui/Button";
import { AdditionalBaggageTableVO } from "./types/additional-baggage";
import { getAllAdditionalBaggages } from "./services/additional-baggage.service";
import TableAdditionalBaggage from "./components/TableAdditionalBaggage";
import ModalCreateAdditionalBaggage from "./components/ModalCreateAdditionalBaggage";
import { Title } from "../components/Title";

export default function AdditonalBaggagePage() {
  const { dict } = useDictionary();

  const [additionalBaggage, setAdditionalBaggages] = useState<AdditionalBaggageTableVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreate = () => setIsCreating(true);

  const fetchAdditionalBaggage = async () => {
    setLoading(true);
    try {
      const response = await getAllAdditionalBaggages(20, page);
      setAdditionalBaggages(response.objects);
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
    fetchAdditionalBaggage();
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
    fetchAdditionalBaggage();
  };

  return (
    <>
      <div>
        <Title title={dict.ADMINISTRATION.SIDEBAR.ADDITIONAL_BAGGAGE} />
        <div className="p-1 m-4 rounded-md">
          <div className="flex flex-row items-end gap-4">
            <Button text={dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.ADD_BAGGAGE} onClick={() => handleCreate()} color="admin" className="" />
            <Button text={dict.ADMINISTRATION.RELOAD} onClick={() => fetchAdditionalBaggage()} color="admin" className="" />
          </div>
          <TableAdditionalBaggage data={additionalBaggage} onRefresh={fetchAdditionalBaggage} />
          <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
        </div>
      </div>
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
      {isCreating && <ModalCreateAdditionalBaggage onClose={() => setIsCreating(false)} onSuccess={handleCreateSuccess} />}
    </>
  );
}
