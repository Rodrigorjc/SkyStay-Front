"use client";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import { useParams } from "next/navigation";
import { ShowHotelDetails } from "../types/hotel";
import { useCallback, useEffect, useState } from "react";
import { addRoomImage, getHotelByCode } from "../services/hotel.service";
import Loader from "@/app/components/ui/Loader";
import { InfoCardHotel } from "@components/admin/InfoCard";
import UploadImage from "@/app/components/upload/UploadImage";
import EditHotelModal from "./components/EditHotelModal";
import Button from "@/app/components/ui/Button";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import Image from "next/image";

export default function HotelsDetails() {
  const { dict } = useDictionary();
  const { hotelCode } = useParams();
  const [hotel, setHotel] = useState<ShowHotelDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);
  const handleOpenModal = () => setIsModalOpen(true);

  const fetchHotel = useCallback(async () => {
    try {
      const response = await getHotelByCode(hotelCode as string);
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
  }, [dict, hotelCode]);

  const handleCreateRoomImage = async (url: string, hotelCode: string, roomType: string) => {
    const parsedHotelCode = Array.isArray(hotelCode) ? hotelCode[0] : hotelCode;

    if (!parsedHotelCode || !url || !roomType) {
      new Error("Invalid parameters");
      return;
    }
    try {
      await addRoomImage({ url, hotelCode: parsedHotelCode, roomType });
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
  }, [hotelCode, fetchHotel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{dict.ADMINISTRATION.ERROR_LOAD_HOTEL}</p>
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
            <InfoCardHotel label={dict.ADMINISTRATION.HOTEL_DETAILS.NAME} value={hotel.name} />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTEL_DETAILS.ADDRESS} value={`${hotel.address}, ${hotel.city}, ${hotel.country}`} />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTELS.PHONE_NUMBER} value={hotel.phone_number} />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTELS.EMAIL} value={hotel.email} />
            <InfoCardHotel
              label={dict.ADMINISTRATION.HOTELS.WEBSITE}
              value={
                <a href={`https://${hotel.website}`} target="_blank" rel="noopener noreferrer" className="underline text-glacier-300">
                  {hotel.website}
                </a>
              }
            />
            <InfoCardHotel label={dict.ADMINISTRATION.HOTELS.DESCRIPTION} value={hotel.description} />
          </div>
        </section>

        {/* Imagen del hotel */}
        {hotel.image && (
          <section>
            <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-4">{dict.ADMINISTRATION.HOTEL_DETAILS.IMAGE}</h2>
            <Image src={hotel.image} alt={hotel.name} width={288} height={288} className="w-full h-72 object-cover rounded-xl shadow-md border border-zinc-700" />
          </section>
        )}

        {/* Habitaciones */}
        <section>
          <h2 className="text-xl font-semibold text-glacier-400 font-mono uppercase mb-6">{dict.ADMINISTRATION.HOTEL_DETAILS.ROOMS}</h2>

          {hotel.roomsDetails && hotel.roomsDetails.length > 0 ? (
            hotel.roomsDetails.map((roomType, index) => (
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
                            handleCreateRoomImage(urls[0] as string, hotelCode as string, roomType.roomType);
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
                      <Image width={288} height={288} src={roomType.image} alt={`${roomType.roomType} image`} className="w-full h-72 object-cover rounded-xl shadow-md border border-zinc-700" />
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
      {isModalOpen && (
        <EditHotelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hotelCode={hotelCode as string}
          initialData={{
            code: hotelCode as string,
            phoneNumber: hotel.phone_number,
            email: hotel.email,
            website: hotel.website,
            description: hotel.description,
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
