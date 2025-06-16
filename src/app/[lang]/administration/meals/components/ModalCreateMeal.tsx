import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import Button from "@/app/components/ui/Button";
import Pagination from "@/app/components/ui/Pagination";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useDictionary } from "@/app/context/DictionaryContext";
import { createMeal } from "../services/meal.service";

interface FlightAddProps {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  isOpen?: boolean;
}

export const flightFormSchema = z.object({
  name: z.string().min(1),
});

export type FlightFormValues = z.infer<typeof flightFormSchema>;

export default function ModalCreateFlight({ onClose, onSuccess, isOpen }: FlightAddProps) {
  const { dict } = useDictionary();

  const [notification, setNotification] = useState<Notifications | null>(null);

  const handleCloseNotification = () => setNotification(null);

  const onSubmit = async (data: FlightFormValues) => {
    try {
      console.log("data", data);
      await createMeal(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.MEALS.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.MEALS.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.MEALS.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.MEALS.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const { handleSubmit, register } = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <>
      <Modal onClose={onClose}>
        <Card>
          <CardHeader color="glacier" className="pt-4">
            {dict.ADMINISTRATION.MEALS.ADD_SINGLE_MEAL}
          </CardHeader>
          <CardContent className="grid gap-4 my-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <InputWithLabel id="name" label={dict.ADMINISTRATION.MEALS.NAME} type="text" {...register("name")} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit(onSubmit)} color="light" text={dict.ADMINISTRATION.SAVE} />
            </div>
          </CardContent>
        </Card>
      </Modal>

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </>
  );
}
