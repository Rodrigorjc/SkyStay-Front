import Button from "@/app/components/ui/Button";
import { useDictionary } from "@context";
import { AddImageAirplaneVO, AirplaneShowVO, ChangeAirplaneStatusVO } from "../types/airplane";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addImageOnAirplane, getAllAirplanesStatus, updateAirplaneStatus } from "@/lib/services/administration.user.service";
import UploadImage from "@/app/components/upload/UploadImage";
import { IoInformationCircleOutline } from "react-icons/io5";
import ImageModal from "../components/ImageModal";

interface Props {
  planes: AirplaneShowVO[];
}

export default function TablePlanes({ planes }: Props) {
  const { dict } = useDictionary();

  const [airplaneStatuses, setAirplaneStatuses] = useState<[string]>();
  const [localPlanes, setLocalPlanes] = useState(planes);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      const response = await updateAirplaneStatus(form);
      console.log(`Estado actualizado correctamente: ${response}`);
      setLocalPlanes(prevPlanes => prevPlanes.map(plane => (plane.code === form.airplaneCode ? { ...plane, status: form.status } : plane)));
    } catch (error) {
      console.error("Error al actualizar el estado del avión:", error);
    }
  };

  const handleImageUpload = async (form: AddImageAirplaneVO) => {
    const response = await addImageOnAirplane(form);
    console.log(`Imagen subida correctamente: ${response}`);
    setLocalPlanes(prevPlanes => prevPlanes.map(plane => (plane.code === form.airplaneCode ? { ...plane, image: form.image[0] } : plane)));
  };

  const router = useRouter();
  return (
    <div className="mt-4 overflow-auto">
      <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300  overflow-hidden overflow-x-scroll text-sm">
        <thead>
          <tr className="font-bold text-left text-sm">
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.CODE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.AIRPLANE_TYPE_NAME}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.MODEL}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.TYPE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.STATUS}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">
              {" "}
              <div className="flex flex-row items-center justify-start gap-2">
                <label className="text-sm font-medium">{dict.ADMINISTRATION.IMAGE}</label>
                <IoInformationCircleOutline className="text-lg" title={dict.ADMINISTRATION.IMAGE_EXPLANATION} />
              </div>
            </th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.CAPACITY}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.DETAILED_INFORMATION}</th>
          </tr>
        </thead>
        <tbody className="">
          {localPlanes.map(plane => (
            <tr key={plane.code} className="hover:bg-zinc-700 transition text-center text-sm">
              <td className="border border-gray-300 px-4 py-2">{plane.code}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.airplaneType.manufacturer}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.airplaneType.name}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.model}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.registrationNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.yearOfManufacture}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.type}</td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={plane.status}
                  onChange={e => {
                    const newStatus = e.target.value;
                    handleStatusChange({ airplaneCode: plane.code, status: newStatus });
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-white bg-glacier-600 hover:bg-glacier-700 transition duration-300 ease-in-out">
                  {airplaneStatuses?.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {plane.image ? (
                  <button onClick={() => setSelectedImage(plane.image)} className="text-white underline hover:text-gray-400 transition ease-in-out duration-300">
                    {dict.SHOW_IMAGE}
                  </button>
                ) : (
                  <UploadImage onUpload={urls => handleImageUpload({ airplaneCode: plane.code, image: urls[0] })} />
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{plane.airplaneType.capacity}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  text={dict.ADMINISTRATION.SHOW}
                  onClick={e => {
                    router.push(`/es/administration/airplanes/${plane.code}`);
                  }}
                  color="light"
                  className="button w-fit"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver imagen de un avion en concreto */}
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}
