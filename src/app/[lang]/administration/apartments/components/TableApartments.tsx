"use client";

import { useDictionary, useLanguage } from "@context";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { HotelVO } from "../../hotels/types/hotel";
import UploadImage from "@/app/components/upload/UploadImage";
import { AddImageVO } from "@/types/common/image";
import { addImageApartment } from "../services/apartment.service";
import ImageModal from "../../components/ImageModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { useRouter } from "next/navigation";
import ApartmentsFormAdd from "./ApartmentsFormAdd";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";

interface AdminApartmentsTableProps {
  data: HotelVO[];
  onRefresh: () => void;
}

export default function AdminApartmentsTable({ data, onRefresh }: AdminApartmentsTableProps) {
  const { dict } = useDictionary();
  const router = useRouter();
  const lang = useLanguage();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => setIsCreating(true);
  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const handleModalClose = () => {
    setIsCreating(false);
  };

  const handleCreateSuccess = (notification: Notifications) => {
    setNotification(notification);
    setIsCreating(false);
    setTimeout(() => {
      onRefresh();
    }, 2500);
  };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (form: AddImageVO) => {
    if (!form.image) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTEL_APARTMENT.ERRORS.LOAD_FAILURE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTEL_APARTMENT.ERRORS.LOAD_FAILURE_MESSAGE,
      });
    }
    try {
      await addImageApartment(form);
      const notification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.HOTEL.SUCCESS.ADD_IMAGE_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.HOTEL.SUCCESS.ADD_IMAGE_MESSAGE,
      };
      setNotification(notification);
      onRefresh();
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTEL.ERRORS.ADD_IMAGE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTEL.ERRORS.ADD_IMAGE_MESSAGE,
      });
    }
  };

  return (
    <div>
      <section>
        <div className="flex flex-row items-end gap-4">
          <Button text={dict.ADMINISTRATION.APARTMENTS.ADD_APPARTMENTS} onClick={() => handleCreate()} color="admin" className="" />
          <Button text={dict.ADMINISTRATION.RELOAD} onClick={() => onRefresh()} color="admin" className="" />
        </div>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.HOTELS.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.ADDRESS}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.POSTAL_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.CITY}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.PHONE_NUMBER}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.EMAIL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.WEBSITE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.DESCRIPTION}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.STARS}</TableHead>
                <TableHead>{dict.ADMINISTRATION.HOTELS.IMAGE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.DETAILED_INFORMATION}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.code} isOdd={index % 2 === 0}>
                  <TableCell>{d.code}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.address}</TableCell>
                  <TableCell>{d.postalCode}</TableCell>
                  <TableCell>
                    {d.city.name}, {d.city.country.name}
                  </TableCell>
                  <TableCell>{d.phoneNumber}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>
                    <a href={d.website}>{d.website}</a>
                  </TableCell>
                  <TableCell className="truncate max-w-sm">{d.description}</TableCell>
                  <TableCell>{d.stars}</TableCell>
                  <TableCell className="text-center">
                    {d.url ? (
                      <Button text={dict.ADMINISTRATION.SHOW} onClick={() => setSelectedImage(d.url)} color="light" />
                    ) : (
                      <UploadImage
                        onUpload={urls => {
                          if (urls && urls.length > 0) {
                            handleImageUpload({ code: d.code, image: urls[0] });
                          } else {
                            setNotification({
                              tipo: "error",
                              titulo: dict.ADMINISTRATION.HOTEL_APARTMENT.ERRORS.LOAD_FAILURE_TITLE,
                              code: 500,
                              mensaje: dict.ADMINISTRATION.HOTEL_APARTMENT.ERRORS.LOAD_FAILURE_MESSAGE,
                            });
                          }
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center truncate min-w-4">
                    <Button text={dict.ADMINISTRATION.SHOW} onClick={() => router.push(`/${lang}/administration/apartments/${d.code}`)} color="light" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {isCreating && <ApartmentsFormAdd onClose={handleModalClose} onSuccess={handleCreateSuccess} />}
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
