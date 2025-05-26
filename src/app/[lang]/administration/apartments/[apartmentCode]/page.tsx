"use client";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import { useParams } from "next/navigation";
import { ShowHotelDetails } from "../../hotels/types/hotel";
import { useEffect, useState } from "react";
import { addRoomImage, getApartmentByCode } from "../services/apartment.service";
import Loader from "@/app/components/ui/Loader";
import { InfoCardHotel } from "@components/admin/InfoCard";
import UploadImage from "@/app/components/upload/UploadImage";
import EditHotelModal from "./components/EditApartmentModal";
import Button from "@/app/components/ui/Button";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";

export default function HotelsDetails() {
  const { dict } = useDictionary();
  const { apartmentCode } = useParams();
  const [apartment, setHotel] = useState<ShowHotelDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);
  const handleOpenModal = () => setIsModalOpen(true);

  const fetchHotel = async () => {
    try {
      const response = await getApartmentByCode(apartmentCode as string);
      setHotel(response.response.objects);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoomImage = async (url: string, hotelCode: string, roomType: string) => {
    const parsedHotelCode = Array.isArray(hotelCode) ? hotelCode[0] : hotelCode;

    if (!parsedHotelCode || !url || !roomType) {
      new Error("Invalid parameters");
      return;
    }

    try {
      await addRoomImage({ url, apartmentCode: parsedHotelCode, roomType });
      fetchHotel();
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTEL.ERRORS.ADD_IMAGE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTEL.ERRORS.ADD_IMAGE_MESSAGE,
      });
    }
  };
  useEffect(() => {
    fetchHotel();
  }, [apartmentCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{dict.ADMINISTRATION.ERROR_LOAD_APARTMENT}</p>
      </div>
    );
  }

  const handleEditSuccess = (notification: Notifications) => {
    setNotification(notification);
    setIsModalOpen(false);
    fetchHotel();
  };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-screen-xl space-y-12">
        <Button text={dict.ADMINISTRATION.EDIT} onClick={() => handleOpenModal()} color="admin" className="" />
        {/* Hotel Data Grid */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6">{dict.ADMINISTRATION.HOTEL_DETAILS.GENERAL_INFORMATION}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <InfoCardHotel label={dict.ADMINISTRATION.HOTEL_DETAILS.NAME} value={apartment.name} />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTEL_DETAILS.ADDRESS} value={`${apartment.address}, ${apartment.city}, ${apartment.country}`} />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTELS.PHONE_NUMBER} value={apartment.phone_number} />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTELS.EMAIL} value={apartment.email} />
            <InfoCardHotel
              label={dict.ADMINISTRATION.HOTELS.WEBSITE}
              value={
                <a href={`https://${apartment.website}`} target="_blank" rel="noopener noreferrer" className="underline text-glacier-300">
                  {apartment.website}
                </a>
              }
            />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTELS.DESCRIPTION} value={apartment.description} />
          </div>
        </section>

        {/* Imagen del hotel */}
        {apartment.image && (
          <section>
            <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-4">{dict.ADMINISTRATION.HOTEL_DETAILS.IMAGE}</h2>
            <img src={apartment.image} alt={apartment.name} className="w-full h-72 object-cover rounded-xl shadow-md border border-zinc-700" />
          </section>
        )}

        {/* Habitaciones */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6">{dict.ADMINISTRATION.HOTEL_DETAILS.ROOMS}</h2>

          {apartment.roomsDetails && apartment.roomsDetails.length > 0 ? (
            apartment.roomsDetails.map((roomType, index) => (
              <div key={index} className="space-y-8 mb-8">
                <div className="flex flex-col gap-4">
                  {/* Título */}
                  <h3 className="text-lg text-zinc-300 font-semibold ">
                    {roomType.roomType} – {roomType.roomCapacity} {dict.ADMINISTRATION.HOTEL_DETAILS.PEOPLE}
                  </h3>

                  {/* Componente UploadImage o Imagen */}
                  {!roomType.image ? (
                    <div className="flex-shrink-0">
                      <UploadImage
                        onUpload={urls => {
                          if (urls && urls.length > 0) {
                            handleCreateRoomImage(urls[0] as string, apartmentCode as string, roomType.roomType);
                            setNotification({
                              tipo: "success",
                              titulo: dict.ADMINISTRATION.HOTEL.SUCCESS.ADD_IMAGE_TITLE,
                              code: 200,
                              mensaje: dict.ADMINISTRATION.HOTEL.SUCCESS.ADD_IMAGE_MESSAGE,
                            });
                          } else {
                            setNotification({
                              tipo: "error",
                              titulo: dict.ADMINISTRATION.HOTEL.ERRORS.ADD_IMAGE_TITLE,
                              code: 400,
                              mensaje: dict.ADMINISTRATION.HOTEL.ERRORS.ADD_IMAGE_MESSAGE,
                            });
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <section className="w-full mb-2">
                      <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-4">{dict.ADMINISTRATION.HOTEL_DETAILS.IMAGE}</h2>
                      <img src={roomType.image} alt={`${roomType.roomType} image`} className="w-full h-72 object-cover rounded-xl shadow-md border border-zinc-700" />
                    </section>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {roomType.rooms.map((room, idx) => (
                    <div
                      key={idx}
                      className={`text-sm text-center font-medium px-3 py-2 rounded-lg border border-zinc-700 ${room.state ? "bg-emerald-600/20 text-emerald-300" : "bg-rose-600/20 text-rose-300"}`}>
                      {dict.ADMINISTRATION.HOTEL_DETAILS.ROOM} {room.roomNumber}
                      <br />
                      {room.state ? dict.ADMINISTRATION.HOTEL_DETAILS.AVAILABLE : dict.ADMINISTRATION.HOTEL_DETAILS.OCCUPIED}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 text-lg font-medium">{dict.ADMINISTRATION.HOTEL_DETAILS.NO_ROOMS_AVAILABLE}</p>
          )}
        </section>
      </div>

      <EditHotelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hotelCode={apartmentCode as string}
        initialData={{
          code: apartmentCode as string,
          phoneNumber: apartment.phone_number,
          email: apartment.email,
          website: apartment.website,
          description: apartment.description,
        }}
        onSuccess={handleEditSuccess}
      />
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
