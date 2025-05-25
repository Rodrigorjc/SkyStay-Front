import React, { useState } from "react";

import { EditHotelVO } from "../../../hotels/types/hotel";
import { updateApartments } from "../../services/apartment.service";
import { useDictionary } from "@/app/context/DictionaryContext";
import { InputWithLabel, TextareaWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";
import { z } from "zod";
import { Notifications } from "@/app/interfaces/Notifications";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";

interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelCode: string;
  initialData: EditHotelVO;
  onSuccess: (notification: Notifications) => void;
}

export const apartmentEditFormSchema = z.object({
  code: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().min(1).email(),
  website: z.string().min(1),
  description: z.string().min(1),
});

export type ApartmentFormValues = z.infer<typeof apartmentEditFormSchema>;

const EditApartmentModal: React.FC<EditHotelModalProps> = ({ isOpen, onClose, hotelCode, initialData, onSuccess }) => {
  const [editHotelData, setEditHotelData] = useState<EditHotelVO>(initialData);

  const { dict } = useDictionary();

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const { handleSubmit, register, getValues, trigger } = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentEditFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async () => {
    try {
      await updateApartments(getValues());
      const notification: Notifications = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.APARTMENTS.SUCCESS.UPDATE_APARTMENT_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.APARTMENTS.SUCCESS.UPDATE_APARTMENT_MESSAGE,
      };
      onSuccess(notification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.APARTMENTS.ERRORS.EDIT_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.APARTMENTS.ERRORS.EDIT_FAILED_MESSAGE,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} onSubmit={e => e.preventDefault()}>
      <Card>
        <CardHeader color="glacier">{dict.ADMINISTRATION.HOTEL_DETAILS.EDIT_HOTEL}</CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <InputWithLabel label={dict.ADMINISTRATION.HOTELS.PHONE_NUMBER} id="phoneNumber" {...register("phoneNumber")} />
            <InputWithLabel label={dict.ADMINISTRATION.HOTELS.EMAIL} id="email" type="email" {...register("email")} />
            <InputWithLabel label={dict.ADMINISTRATION.HOTELS.WEBSITE} id="website" {...register("website")} />
            <TextareaWithLabel label={dict.ADMINISTRATION.HOTELS.DESCRIPTION} id="description" {...register("description")} />
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              text={dict.ADMINISTRATION.SAVE}
              onClick={async () => {
                const values = getValues();

                if (values.phoneNumber && /[^\d\s+]/.test(values.phoneNumber) && values.phoneNumber.length > 5 && values.phoneNumber.length <= 16) {
                  setNotification({
                    tipo: "error",
                    titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                    code: 400,
                    mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.PHONE_NUMBER_FORMAT,
                  });
                  return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (values.email && !emailRegex.test(values.email)) {
                  setNotification({
                    tipo: "error",
                    titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                    code: 400,
                    mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.EMAIL_FORMAT,
                  });
                  return;
                }

                const isValid = await trigger(["code", "phoneNumber", "email", "website", "description"]);
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
              color="admin"
            />
          </div>
        </CardContent>
      </Card>
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </Modal>
  );
};

export default EditApartmentModal;
