"use client";

import { useDictionary } from "@context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import ImageModal from "../../components/ImageModal";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { AirlineAddImageVO, AirlineTableVO } from "../types/airline";
import ModalEditAirline from "./ModalEditAirline";
import UploadImage from "@/app/components/upload/UploadImage";
import { addAirlineImage } from "../services/airline.service";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Notifications } from "@/app/interfaces/Notifications";

interface AirlineTableProps {
  data: AirlineTableVO[];
  onRefresh: () => void;
}

export default function AirlineTable({ data, onRefresh }: AirlineTableProps) {
  const { dict } = useDictionary();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editData, setSelectEdit] = useState<AirlineTableVO | null>(null);
  const [notification, setNotification] = useState<Notifications | null>(null);

  const handleCloseNotification = () => setNotification(null);
  const handleImageUpload = async (form: AirlineAddImageVO) => {
    if (!form.url) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
        code: 400,
        mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
      });
      return;
    }
    try {
      await addAirlineImage(form);
      setNotification({
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRLINE.SUCCESS.IMAGE_UPLOAD_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.AIRLINE.SUCCESS.IMAGE_UPLOAD_MESSAGE,
      });
      onRefresh();
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRLINE.ERRORS.IMAGE_UPLOAD_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRLINE.ERRORS.IMAGE_UPLOAD_MESSAGE,
      });
    }
  };

  return (
    <div>
      <section>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.AIRLINE.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRLINE.NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRLINE.PHONE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRLINE.EMAIL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRLINE.WEBSITE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRLINE.IATA_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.IMAGE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.EDIT}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.code} isOdd={index % 2 === 0}>
                  <TableCell>{d.code}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{d.website}</TableCell>
                  <TableCell>{d.iataCode}</TableCell>
                  <TableCell>
                    {d.image ? (
                      <Button text={dict.ADMINISTRATION.SHOW} onClick={() => setSelectedImage(d.image)} color="light" />
                    ) : (
                      <UploadImage
                        onUpload={urls => {
                          if (urls && urls.length > 0) {
                            handleImageUpload({ code: d.code, url: urls[0] });
                          } else {
                            setNotification({
                              tipo: "error",
                              titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                              code: 400,
                              mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                            });
                          }
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      text={dict.ADMINISTRATION.EDIT}
                      onClick={() => {
                        setSelectEdit(data[index]);
                      }}
                      color="light"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {editData && (
        <ModalEditAirline
          originalData={editData}
          onClose={() => setSelectEdit(null)}
          onSuccess={notification => {
            setNotification(notification);
            setSelectEdit(null);
          }}
        />
      )}
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
