import React, { useState } from "react";
import { useDictionary } from "@context";
import { createSeatConfiguration } from "../services/airplane.service";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";
interface Props {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  isOpen?: boolean;
}

export const formSchema = z.object({
  seatPattern: z.string().min(1),
  description: z.string().min(1),
});

export type FormValues = z.infer<typeof formSchema>;

export default function SeatConfigurationModalForm({ onClose, onSuccess }: Props) {
  const { dict } = useDictionary();

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const onSubmit = async (data: FormValues) => {
    try {
      await createSeatConfiguration(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPLANES.SEAT_CONFIGURATION.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.AIRPLANES.SEAT_CONFIGURATION.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.SEAT_CONFIGURATION.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.SEAT_CONFIGURATION.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const { handleSubmit, register, trigger } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seatPattern: "",
      description: "",
    },
  });

  return (
    <>
      <Modal onClose={onClose}>
        <Card>
          <CardHeader color="glacier" className="pt-4">
            {dict.ADMINISTRATION.AIRLINE.ADD_AIRLINE}
          </CardHeader>
          <CardContent className="grid gap-4 my-4">
            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-4 w-full">
                <InputWithLabel id="seatPattern" label={dict.ADMINISTRATION.AIRPLANES.SEAT_PATTERN} type="text" {...register("seatPattern")} />
                <InputWithLabel id="description" label={dict.ADMINISTRATION.DESCRIPTION} type="text" {...register("description")} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={async () => {
                  const isValid = await trigger(["seatPattern", "description"]);
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
