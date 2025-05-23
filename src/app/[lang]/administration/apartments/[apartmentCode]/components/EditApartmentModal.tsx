import React, { useState } from "react";

import { EditHotelVO } from "../../../hotels/types/hotel";
import { updateApartments } from "../../services/apartment.service";
import { useDictionary } from "@/app/context/DictionaryContext";
import { InputWithLabel, TextareaWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";

interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelCode: string;
  initialData: EditHotelVO;
  onSuccess: () => void;
}

const EditApartmentModal: React.FC<EditHotelModalProps> = ({ isOpen, onClose, hotelCode, initialData, onSuccess }) => {
  const [editHotelData, setEditHotelData] = useState<EditHotelVO>(initialData);

  const { dict } = useDictionary();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditHotelData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdateApartment = async () => {
    try {
      await updateApartments(editHotelData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating hotel details:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} onSubmit={handleUpdateApartment}>
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-4 text-center">{dict.ADMINISTRATION.HOTEL_DETAILS.EDIT_HOTEL}</h2>

        <div className="flex flex-col space-y-4">
          <InputWithLabel label={dict.ADMINISTRATION.HOTELS.PHONE_NUMBER} id="phone_number" name="phone_number" value={editHotelData.phoneNumber} onChange={handleInputChange} />
          <InputWithLabel label={dict.ADMINISTRATION.HOTELS.EMAIL} id="email" name="email" type="email" value={editHotelData.email} onChange={handleInputChange} />
          <InputWithLabel label={dict.ADMINISTRATION.HOTELS.WEBSITE} id="website" name="website" value={editHotelData.website} onChange={handleInputChange} />
          <TextareaWithLabel label={dict.ADMINISTRATION.HOTELS.DESCRIPTION} id="description" name="description" value={editHotelData.description} onChange={handleInputChange} />
        </div>
        <div className="mt-8 flex justify-between space-x-4">
          <Button text={dict.ADMINISTRATION.BACK} onClick={() => onClose()} color="admin" className="" />
          <Button text={dict.ADMINISTRATION.SAVE} onClick={() => handleUpdateApartment()} color="admin" className="" />
        </div>
      </div>
    </Modal>
  );
};

export default EditApartmentModal;
