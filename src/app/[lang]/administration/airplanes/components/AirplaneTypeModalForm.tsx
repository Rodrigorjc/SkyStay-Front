"use client";

import { useState } from "react";
import { useDictionary } from "@context";
import { createAirplaneType } from "../services/airplane.service";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";

const airplaneTypeSchema = z.object({
  name: z.string().min(1),
  manufacturer: z.string().min(1),
  capacity: z.coerce.number().min(1),
});

type AirplaneTypeFormValues = z.infer<typeof airplaneTypeSchema>;

interface Props {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  notifications?: Notifications | null;
}

export default function AirplaneTypeFormAdd({ onClose, onSuccess }: Props) {
  const { dict } = useDictionary();
  const [notification, setNotification] = useState<Notifications | null>(null);

  const { register, handleSubmit, trigger, reset } = useForm<AirplaneTypeFormValues>({
    resolver: zodResolver(airplaneTypeSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      capacity: 1,
    },
  });

  const onSubmit = async (data: AirplaneTypeFormValues) => {
    try {
      await createAirplaneType(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPLANES.SUCCESS.AIRPLANE_TYPE.CREATION_SUCCESS_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.AIRPLANES.SUCCESS.AIRPLANE_TYPE.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.AIRPLANE_TYPE.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.AIRPLANE_TYPE.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const handleCloseNotification = () => setNotification(null);

  return (
    <>
      <Modal onClose={onClose} onSubmit={e => e.preventDefault()}>
        <Card>
          <CardHeader color="glacier" className="pt-4">
            {dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE_TYPE}
          </CardHeader>
          <CardContent className="grid gap-4 my-4">
            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-4 w-full">
                <InputWithLabel id="name" label={dict.ADMINISTRATION.AIRPLANES.AIRPLANE_TYPE_NAME} type="text" {...register("name")} />
                <InputWithLabel id="manufacturer" label={dict.ADMINISTRATION.AIRPLANES.MANUFACTURER} type="text" {...register("manufacturer")} />
                <InputWithLabel id="capacity" label={dict.ADMINISTRATION.AIRPLANES.CAPACITY} type="text" {...register("capacity")} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={async () => {
                  const isValid = await trigger(["name", "manufacturer", "capacity"]);
                  if (!isValid) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                    });
                    return;
                  }
                  handleSubmit(onSubmit)();
                }}
                color="light"
                text={dict.ADMINISTRATION.SAVE}
              />
            </div>
          </CardContent>
        </Card>
      </Modal>

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </>
  );
}
