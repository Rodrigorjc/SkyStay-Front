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
import { editAirline } from "../services/airline.service";

const airlineEditFormSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  website: z.string().min(1),
  iataCode: z.string().min(1),
});

type AirlineFormValues = z.infer<typeof airlineEditFormSchema>;

interface ModalEditAirlineProps {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  originalData: AirlineFormValues & { code: string };
}

export default function ModalEditAirline({ onClose, onSuccess, originalData }: ModalEditAirlineProps) {
  const { dict } = useDictionary();
  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const { handleSubmit, register, trigger } = useForm<AirlineFormValues>({
    resolver: zodResolver(airlineEditFormSchema),
    defaultValues: {
      code: originalData.code,
      name: originalData.name,
      phone: originalData.phone,
      email: originalData.email,
      website: originalData.website,
      iataCode: originalData.iataCode,
    },
  });

  const onSubmit = async (data: AirlineFormValues) => {
    try {
      await editAirline(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRLINE.SUCCESS.EDIT_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.AIRLINE.SUCCESS.EDIT_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      console.error("Error editing airline:", error);
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRLINE.ERRORS.EDIT_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRLINE.ERRORS.EDIT_FAILED_MESSAGE,
      });
    }
  };

  return (
    <>
      <Modal onClose={onClose} onSubmit={e => e.preventDefault()}>
        <Card>
          <CardHeader color="glacier" className="pt-4">
            {dict.ADMINISTRATION.AIRLINE.EDIT_AIRLINE}
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
