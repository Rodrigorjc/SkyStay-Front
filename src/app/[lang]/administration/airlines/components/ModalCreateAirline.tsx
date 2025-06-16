import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useDictionary } from "@/app/context/DictionaryContext";
import { createAirline } from "../services/airline.service";
import StepsForm from "@/app/components/ui/admin/StepsForm";

interface AirlineAddProps {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  isOpen?: boolean;
}

export const airlineFormSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  website: z.string().min(1),
  iataCode: z.string().min(1),
});

export type AirlineFormValues = z.infer<typeof airlineFormSchema>;

export default function ModalCreateAirline({ onClose, onSuccess }: AirlineAddProps) {
  const { dict } = useDictionary();

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const onSubmit = async (data: AirlineFormValues) => {
    try {
      await createAirline(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRLINE.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.AIRLINE.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRLINE.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRLINE.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const { handleSubmit, register, trigger } = useForm<AirlineFormValues>({
    resolver: zodResolver(airlineFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      iataCode: "",
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
                <InputWithLabel id="name" label={dict.ADMINISTRATION.AIRLINE.NAME} type="text" {...register("name")} />
                <InputWithLabel id="phone" label={dict.ADMINISTRATION.AIRLINE.PHONE} type="text" {...register("phone")} />
                <InputWithLabel id="email" label={dict.ADMINISTRATION.AIRLINE.EMAIL} type="text" {...register("email")} />
                <InputWithLabel id="website" label={dict.ADMINISTRATION.AIRLINE.WEBSITE} type="text" {...register("website")} />
                <InputWithLabel id="iataCode" label={dict.ADMINISTRATION.AIRLINE.IATA_CODE} type="text" {...register("iataCode")} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={async () => {
                  const isValid = await trigger(["name", "phone", "email", "website", "iataCode"]);
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
