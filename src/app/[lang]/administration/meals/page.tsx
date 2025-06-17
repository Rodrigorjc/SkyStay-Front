"use client";
import { useCallback, useEffect, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import Button from "@/app/components/ui/Button";
import { MealTableVO } from "./types/meal";
import { getAllMeals } from "./services/meal.service";
import ModalCreateMeal from "./components/ModalCreateMeal";
import TableMeals from "./components/TableMeals";
import { Title } from "../components/Title";

export default function FlightsPage() {
  const { dict } = useDictionary();

  const [meals, setMeals] = useState<MealTableVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreate = () => setIsCreating(true);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllMeals(20, page);
      setMeals(response.objects);
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
  }, [dict, page]);

  useEffect(() => {
    fetchMeals();
  }, [page, fetchMeals]);

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
    fetchMeals();
  };

  return (
    <>
      <Title title={dict.ADMINISTRATION.SIDEBAR.MEALS} />
      <div className="p-1 m-4">
        <div className="flex flex-row items-end gap-4">
          <Button text={dict.ADMINISTRATION.MEALS.ADD_SINGLE_MEAL} onClick={() => handleCreate()} color="admin" className="" />
          <Button text={dict.ADMINISTRATION.RELOAD} onClick={() => fetchMeals()} color="admin" className="" />
        </div>
        <TableMeals data={meals} onRefresh={fetchMeals} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
      {isCreating && <ModalCreateMeal onClose={() => setIsCreating(false)} onSuccess={handleCreateSuccess} isOpen={false} />}
    </>
  );
}
