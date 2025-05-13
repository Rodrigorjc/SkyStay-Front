"use client";

import { useDictionary, useLanguage } from "@context";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { HotelVO } from "../types/hotel";
import UploadImage from "@/app/components/upload/UploadImage";
import { AddImageVO } from "@/types/common/image";
import { addImageHotel } from "../services/hotel.service";
import ImageModal from "../../components/ImageModal";
import HotelsFormAdd from "./HotelsFormAdd";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { useRouter } from "next/navigation";

interface AdminHotelsTableProps {
  data: HotelVO[];
  onRefresh: () => void;
}

export default function AdminHotelsTable({ data, onRefresh }: AdminHotelsTableProps) {
  const { dict } = useDictionary();
  const router = useRouter();
  const lang = useLanguage();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => setIsCreating(true);

  const handleModalClose = () => {
    setIsCreating(false);
  };

  const handleSuccess = () => {
    handleModalClose();
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (form: AddImageVO) => {
    if (!form.image) {
      console.error("No se proporcionó una imagen para subir.");
      return;
    }

    try {
      const response = await addImageHotel(form);
      console.log(`Imagen subida correctamente: ${response}`);
      onRefresh();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div>
      <section>
        <div className="flex flex-row items-end gap-4">
          <Button text={dict.ADMINISTRATION.HOTELS.ADD_HOTELS} onClick={() => handleCreate()} color="admin" className="" />
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
                            console.error("No se recibieron URLs de imagen.");
                          }
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center truncate min-w-4">
                    <Button text={dict.ADMINISTRATION.SHOW} onClick={() => router.push(`/${lang}/administration/hotels/${d.code}`)} color="light" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {isCreating && <HotelsFormAdd onClose={handleModalClose} onSuccess={handleSuccess} />}
    </div>
  );
}
