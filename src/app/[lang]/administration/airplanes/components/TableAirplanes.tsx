import Button from "@/app/components/ui/Button";
import { useDictionary, useLanguage } from "@context";
import { AirplaneShowVO, ChangeAirplaneStatusVO } from "../types/airplane";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addImageOnAirplane, getAllAirplanesStatus, updateAirplaneStatus } from "../services/airplane.service";
import UploadImage from "@/app/components/upload/UploadImage";
import ImageModal from "../../components/ImageModal";
import { AddImageVO } from "@/types/common/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Select } from "@/app/components/ui/admin/Label";

interface Props {
  planes: AirplaneShowVO[];
}

export default function TablePlanes({ planes }: Props) {
  const { dict } = useDictionary();
  const lang = useLanguage();
  const [airplaneStatuses, setAirplaneStatuses] = useState<string[]>([]);
  const [localPlanes, setLocalPlanes] = useState(planes);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusesResponse = await getAllAirplanesStatus();
        setAirplaneStatuses(statusesResponse.response.objects);
      } catch (error) {
        console.error("Error al obtener todos los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (form: ChangeAirplaneStatusVO) => {
    try {
      await updateAirplaneStatus(form);
      setNotification({
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPLANES.SUCCESS.AIRPLANE_TYPE.STATUS_UPDATE_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.AIRPLANES.SUCCESS.AIRPLANE_TYPE.STATUS_UPDATE_MESSAGE,
      });
      setLocalPlanes(prevPlanes => prevPlanes.map(plane => (plane.code === form.airplaneCode ? { ...plane, status: form.status } : plane)));
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.AIRPLANE_TYPE.UPDATE_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.AIRPLANE_TYPE.UPDATE_FAILED_MESSAGE,
      });
    }
  };

  const handleImageUpload = async (form: AddImageVO) => {
    try {
      await addImageOnAirplane(form);
      setNotification({
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPLANES.SUCCESS.IMAGE_UPLOAD_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.AIRPLANES.SUCCESS.IMAGE_UPLOAD_MESSAGE,
      });
      setLocalPlanes(prevPlanes => prevPlanes.map(plane => (plane.code === form.code ? { ...plane, image: form.image } : plane)));
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.IMAGE_UPLOAD_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.IMAGE_UPLOAD_FAILED_MESSAGE,
      });
    }
  };

  const router = useRouter();
  return (
    <div className="mt-8 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{dict.ADMINISTRATION.CODE}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.AIRPLANE_TYPE_NAME}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.MODEL}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}</TableHead>
            <TableHead>{dict.ADMINISTRATION.TYPE}</TableHead>
            <TableHead>{dict.ADMINISTRATION.STATUS}</TableHead>
            <TableHead>{dict.ADMINISTRATION.IMAGE}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.CAPACITY}</TableHead>
            <TableHead>{dict.ADMINISTRATION.AIRPLANES.AIRLINE_NAME}</TableHead>
            <TableHead>{dict.ADMINISTRATION.DETAILED_INFORMATION}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localPlanes.map((plane, index) => (
            <TableRow key={plane.code} isOdd={index % 2 === 0}>
              <TableCell>{plane.code}</TableCell>
              <TableCell>{plane.airplaneType.manufacturer}</TableCell>
              <TableCell>{plane.airplaneType.name}</TableCell>
              <TableCell>{plane.model}</TableCell>
              <TableCell>{plane.registrationNumber}</TableCell>
              <TableCell>{plane.yearOfManufacture}</TableCell>
              <TableCell>{plane.type}</TableCell>
              <TableCell>
                <Select value={plane.status} onChange={e => handleStatusChange({ airplaneCode: plane.code, status: e.target.value })} className="border border-gray-300 rounded px-2 py-1">
                  {airplaneStatuses?.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                {plane.image ? (
                  <Button text={dict.SHOW_IMAGE} onClick={() => setSelectedImage(plane.image)} color="light" />
                ) : (
                  <UploadImage onUpload={urls => handleImageUpload({ code: plane.code, image: urls[0] })} />
                )}
              </TableCell>
              <TableCell>{plane.airplaneType.capacity}</TableCell>
              <TableCell>{plane.airlineName}</TableCell>
              <TableCell>
                <Button text={dict.ADMINISTRATION.SHOW} onClick={() => router.push(`/${lang}/administration/airplanes/${plane.code}`)} color="light" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
