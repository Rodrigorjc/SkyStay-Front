"use client";
import React, { JSX, useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation";
import {
  getAccommodationDetails,
  toggleFavoriteAccommodation,
} from "@/app/[lang]/accommodation/services/accommodationService";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  FaHeart,
  FaRegHeart,
  FaImages,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAmenityIcon } from "@/app/[lang]/accommodation/utils/amenitiesMap";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";
import { useDictionary } from "@context";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AccommodationReviews from "../components/AccommodationReviews";

interface Room {
  availableCount: number;
  capacity: number;
  roomConfigId: number;
  roomType: string;
  price: number;
}

interface AccommodationDetails {
  name: string;
  description: string;
  images: string[];
  address: string;
  cityName: string;
  countryName: string;
  email: string;
  phoneNumber: string;
  postalCode: string;
  stars: number;
  website: string;
  availableRooms: Room[];
  amenities: string;
  accommodationType: string;
  code: string;
  averageRating?: number;
  isFavorite?: boolean;
}

export default function AccommodationPage() {
  const { dict } = useDictionary();
  const { code, lang } = useParams() as { code: string; lang: string };
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [details, setDetails] = useState<AccommodationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: number }>(
    {}
  );
  const [showGallery, setShowGallery] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notifications>();
  const [currentAnimation, setCurrentAnimation] = useState("");

  useEffect(() => {
    const loadAccommodationDetails = async () => {
      try {
        const params = {
          checkIn: searchParams.get("checkIn") || undefined,
          checkOut: searchParams.get("checkOut") || undefined,
          adults: searchParams.has("adults")
            ? parseInt(searchParams.get("adults") || "0")
            : undefined,
          children: searchParams.has("children")
            ? parseInt(searchParams.get("children") || "0")
            : undefined,
          rooms: searchParams.has("rooms")
            ? parseInt(searchParams.get("rooms") || "0")
            : undefined,
        };
        const typeAccommodation =
          searchParams.get("typeAccomodation") || "hotel";

        const data = await getAccommodationDetails(
          code,
          typeAccommodation,
          params
        );
        const responseData = data.response.objects;

        // Mantén el valor original de isFavorite
        const detailsWithFavorite = {
          ...responseData,
          isFavorite: responseData.isFavorite,
        };

        setDetails(detailsWithFavorite);
        setIsFavorite(!!detailsWithFavorite.isFavorite);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(dict.CLIENT.ACCOMMODATION.ERROR_UNKNOWN);
        }
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      loadAccommodationDetails();
    }
  }, [code, searchParams, dict]);

  const animations = [
    "animate-heartBeat",
    "animate-ripple",
    "animate-rotate",
    "animate-confetti",
    "animate-bounce-custom",
    "animate-pulseGlow",
  ];
  const getRandomHeartAnimation = () =>
    animations[Math.floor(Math.random() * animations.length)];

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = Cookies.get("token");
    if (!token) {
      const noti: Notifications = {
        titulo: dict.CLIENT.ACCOMMODATION.FAVORITE_LOGIN_TITLE,
        mensaje: dict.CLIENT.ACCOMMODATION.FAVORITE_LOGIN_MESSAGE,
        code: 401,
        tipo: "warning",
      };
      setNotification(noti);
      setTimeout(() => setNotification(undefined), 5000);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    setIsAnimating(true);
    setCurrentAnimation(getRandomHeartAnimation());

    try {
      if (!details) throw new Error(dict.CLIENT.ACCOMMODATION.ERROR_INCOMPLETE);
      await toggleFavoriteAccommodation(
        details.code,
        details.accommodationType,
        isFavorite
      );
      setIsFavorite(!isFavorite);
      setTimeout(() => setIsAnimating(false), 800);
    } catch {
      const notiError: Notifications = {
        titulo: dict.CLIENT.ACCOMMODATION.FAVORITE_ERROR_TITLE,
        mensaje: dict.CLIENT.ACCOMMODATION.FAVORITE_ERROR_MESSAGE,
        code: 500,
        tipo: "error",
      };
      setNotification(notiError);
      setTimeout(() => setNotification(undefined), 5000);
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoom = (roomConfigId: number, quantity: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomConfigId]: quantity,
    }));
  };

  const handleReserveClick = () => {
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const params = new URLSearchParams();

    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("code", details?.code || code);

    if (details?.accommodationType) {
      params.set("type", details.accommodationType);
    }

    if (details?.accommodationType === "hotel") {
      Object.entries(selectedRooms).forEach(([roomId, qty]) => {
        if (qty > 0) params.append("rooms", `${roomId}:${qty}`);
      });
    } else {
      params.set("apartment", "1");
    }

    router.push(`/${lang}/accommodation/reservation?${params.toString()}`);
  };

  const getAvailabilityStatus = (count: number) => {
    if (count < 5)
      return {
        text: dict.CLIENT.ACCOMMODATION.AVAILABILITY.LAST.replace(
          "{{count}}",
          String(count)
        ),
        color: "text-red-500",
      };
    if (count < 20)
      return {
        text: dict.CLIENT.ACCOMMODATION.AVAILABILITY.FEW,
        color: "text-yellow-500",
      };
    return {
      text: dict.CLIENT.ACCOMMODATION.AVAILABILITY.AVAILABLE,
      color: "text-green-500",
    };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-glacier-100">
        {dict.CLIENT.ACCOMMODATION.LOADING}
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {dict.CLIENT.ACCOMMODATION.ERROR}: {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 text-glacier-50">
      {notification && (
        <NotificationComponent
          Notifications={notification}
          onClose={() => setNotification(undefined)}
        />
      )}
      {details && (
        <>
          {/* Header */}
          <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-glacier-200 mb-2 md:mb-0 mr-3">
                {details.name}
              </h1>
              <button
                onClick={handleToggleFavorite}
                className={`text-xl sm:text-2xl focus:outline-none transition-transform ${
                  isAnimating ? currentAnimation : ""
                }`}
                disabled={isLoading}
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-glacier-300 hover:text-red-400" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 bg-zinc-800/70 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
              {details.accommodationType !== "apartment" ? (
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < details.stars ? "" : "text-glacier-800 opacity-30"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
              {details.averageRating && (
                <>
                  {details.accommodationType !== "apartment" && (
                    <div className="h-4 sm:h-5 w-px bg-glacier-600 mx-1"></div>
                  )}
                  <div className="flex items-center text-xs sm:text-sm">
                    <FaTrophy className="mr-1 text-yellow-400" />
                    <span className="font-medium text-white">
                      {details.averageRating.toFixed(1)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Image Collage */}
          <div className="grid gap-2 sm:gap-4 grid-cols-12 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[250px] mb-4 sm:mb-8">
            {details.images &&
              details.images.slice(0, 5).map((img, idx) => {
                let classes;
                switch (idx) {
                  case 0:
                    classes =
                      "col-span-12 row-span-2 sm:col-span-6 sm:row-span-2";
                    break;
                  case 1:
                    classes = "col-span-6 row-span-1 sm:col-span-3 sm:row-span-1";
                    break;
                  case 2:
                    classes = "col-span-6 row-span-1 sm:col-span-3 sm:row-span-1";
                    break;
                  case 3:
                    classes = "col-span-6 row-span-1 sm:col-span-4 sm:row-span-1";
                    break;
                  case 4:
                    classes = "col-span-6 row-span-1 sm:col-span-2 sm:row-span-1";
                    break;
                  default:
                    classes = "";
                }
                return (
                  <div
                    key={idx}
                    className={`relative overflow-hidden rounded-lg shadow-md group cursor-pointer ${classes}`}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setShowGallery(true);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${details.name} - ${dict.CLIENT.ACCOMMODATION.IMAGE_ALT.replace(
                        "{{index}}",
                        String(idx + 1)
                      )}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {idx === 4 && details.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <FaImages className="text-2xl sm:text-4xl mx-auto mb-1 sm:mb-2" />
                          <p className="font-medium text-base sm:text-lg">
                            {dict.CLIENT.ACCOMMODATION.GALLERY_PHOTOS_COUNT.replace(
                              "{{count}}",
                              String(details.images.length - 5)
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3 text-white">
                      <p className="text-xs sm:text-sm font-medium">
                        {`${details.name} - ${dict.CLIENT.ACCOMMODATION.IMAGE_ALT.replace(
                          "{{index}}",
                          String(idx + 1)
                        )}`}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Gallery Modal mejorado */}
          {showGallery && (
            <div
              className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center backdrop-blur-sm"
              onClick={() => setShowGallery(false)}
            >
              {/* Header del modal */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-zinc-900/90 to-transparent p-4 sm:p-6">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                  <div className="text-white">
                    <h3 className="text-lg sm:text-xl font-semibold text-glacier-100">
                      {details.name}
                    </h3>
                    <p className="text-sm text-glacier-300 mt-1">
                      {dict.CLIENT.ACCOMMODATION.GALLERY_TITLE || "Galería de imágenes"}
                    </p>
                  </div>
                  
                  <button
                    className="bg-zinc-800/80 hover:bg-zinc-700/80 text-glacier-200 hover:text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-zinc-600 hover:border-zinc-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGallery(false);
                    }}
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Contenedor principal de la imagen */}
              <div
                className="relative w-full max-w-6xl mx-4 h-[70vh] sm:h-[80vh] mt-20 mb-16"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Imagen principal */}
                <div className="relative w-full h-full bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-700">
                  <Image
                    src={details.images[activeImageIndex]}
                    alt={`${details.name} - ${dict.CLIENT.ACCOMMODATION.IMAGE_ALT.replace(
                      "{{index}}",
                      String(activeImageIndex + 1)
                    )}`}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Overlay sutil para mejorar la legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none" />
                </div>

                {/* Botones de navegación mejorados */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-800/90 hover:bg-zinc-700/90 backdrop-blur-sm text-glacier-200 hover:text-white p-4 rounded-full transition-all duration-200 border border-zinc-600 hover:border-zinc-500 shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) =>
                      prev === 0 ? details.images.length - 1 : prev - 1
                    );
                  }}
                  disabled={details.images.length <= 1}
                >
                  <FaArrowLeft className="text-lg" />
                </button>

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-800/90 hover:bg-zinc-700/90 backdrop-blur-sm text-glacier-200 hover:text-white p-4 rounded-full transition-all duration-200 border border-zinc-600 hover:border-zinc-500 shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev + 1) % details.images.length);
                  }}
                  disabled={details.images.length <= 1}
                >
                  <FaArrowRight className="text-lg" />
                </button>
              </div>

              {/* Footer con información e indicadores */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-zinc-900/90 to-transparent p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                  {/* Indicadores de posición */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-zinc-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-600">
                      <span className="text-glacier-100 font-medium">
                        {activeImageIndex + 1} / {details.images.length}
                      </span>
                    </div>
                  </div>

                  {/* Miniaturas navegables */}
                  {details.images.length > 1 && (
                    <div className="flex justify-center space-x-2 overflow-x-auto pb-2 max-w-full">
                      {details.images.slice(0, 8).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(idx);
                          }}
                          className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                            idx === activeImageIndex
                              ? 'border-glacier-400 shadow-lg scale-105'
                              : 'border-zinc-600 hover:border-zinc-500 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                      
                      {details.images.length > 8 && (
                        <div className="flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 bg-zinc-800/80 border-2 border-zinc-600 rounded-lg flex items-center justify-center">
                          <span className="text-glacier-300 text-xs font-medium">
                            +{details.images.length - 8}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="text-center mt-4">
                    <p className="text-glacier-300 text-sm">
                      {dict.CLIENT.ACCOMMODATION.GALLERY_NAVIGATION || "Usa las flechas o haz clic en las miniaturas para navegar"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicador de carga */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-zinc-800/80 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 transition-opacity duration-200">
                  <span className="text-glacier-200 text-sm">Cargando...</span>
                </div>
              </div>
            </div>
          )}

          {/* Availability / Reservation Section */}
          <div className="mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-glacier-200 mb-3 sm:mb-4 border-b-2 border-glacier-500 pb-2">
              {details.accommodationType === "apartment"
                ? dict.CLIENT.ACCOMMODATION.SECTION_APARTMENT
                : dict.CLIENT.ACCOMMODATION.SECTION_HOTEL_ROOMS}
            </h2>

            {details.availableRooms && details.availableRooms.length > 0 ? (
              <>
                {details.accommodationType === "apartment" ? (
                  <div className="bg-zinc-700 rounded-lg p-4 sm:p-6 border border-glacier-700 shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-glacier-300">
                          {details.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-glacier-100 mt-1">
                          {dict.CLIENT.ACCOMMODATION.APARTMENT_CAPACITY.replace(
                            "{{capacity}}",
                            String(
                              Math.max(
                                ...details.availableRooms.map(
                                  (room) => room.capacity
                                )
                              )
                            )
                          )}
                        </p>
                        <p className="text-green-500 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
                          {dict.CLIENT.ACCOMMODATION.IMMEDIATE_BOOKING}
                        </p>
                      </div>
                      <div className="text-right mt-3 sm:mt-0">
                        <p className="text-base sm:text-lg font-bold text-glacier-200">
                          {details.availableRooms[0].price}€ /noche
                        </p>
                        <p className="text-xs sm:text-sm text-glacier-400">
                          {dict.CLIENT.ACCOMMODATION.TAX_INCLUDED}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-glacier-800">
                      <p className="text-sm text-glacier-200 mb-3">
                        {dict.CLIENT.ACCOMMODATION.APARTMENT_NOTE}
                      </p>
                      <button
                        className="w-full sm:w-auto px-4 py-2 rounded-md text-sm bg-glacier-500 hover:bg-glacier-600 text-white transition duration-300"
                        onClick={handleReserveClick}
                      >
                        {dict.CLIENT.ACCOMMODATION.RESERVE_APARTMENT}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-glacier-800/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-glacier-100 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm">
                          {dict.CLIENT.ACCOMMODATION.ROOM_TYPES_INFO.replace(
                            "{{count}}",
                            String(details.availableRooms.length)
                          )}
                        </p>
                        <p className="text-xs mt-1 text-glacier-300">
                          {dict.CLIENT.ACCOMMODATION.SWIPE_INFO}
                        </p>
                      </div>
                      <div className="text-right text-xs mt-2 sm:mt-0">
                        {dict.CLIENT.ACCOMMODATION.SELECT_INFO}
                      </div>
                    </div>

                    <Swiper
                      modules={[]}
                      spaceBetween={10}
                      slidesPerView={1}
                      breakpoints={{
                        640: { spaceBetween: 15, slidesPerView: 1.5 },
                        768: { spaceBetween: 20, slidesPerView: 2 },
                        1024: { spaceBetween: 20, slidesPerView: 2 },
                      }}
                      className="mySwiper"
                    >
                      {details.availableRooms.map((room) => {
                        const availability = getAvailabilityStatus(
                          room.availableCount
                        );
                        return (
                          <SwiperSlide key={room.roomConfigId}>
                            <div className="bg-zinc-700 rounded-lg p-3 sm:p-5 border border-glacier-700 shadow-md h-full">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-semibold text-glacier-300">
                                    {room.roomType}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-glacier-100 mt-1">
                                    {dict.CLIENT.ACCOMMODATION.CAPACITY_LABEL.replace(
                                      "{{capacity}}",
                                      String(room.capacity)
                                    )}
                                  </p>
                                  <p
                                    className={`${availability.color} font-medium text-xs sm:text-sm mt-1 sm:mt-2`}
                                  >
                                    {availability.text}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-base sm:text-lg font-bold text-glacier-200">
                                    {room.price}€ /noche
                                  </p>
                                  <p className="text-xs sm:text-sm text-glacier-400">
                                    {dict.CLIENT.ACCOMMODATION.TAX_INCLUDED}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-glacier-800 flex items-center">
                                <label
                                  htmlFor={`room-${room.roomConfigId}`}
                                  className="text-sm text-glacier-200 mr-2"
                                >
                                  {dict.CLIENT.ACCOMMODATION.QUANTITY_LABEL}
                                </label>
                                <div className="relative w-full sm:w-auto">
                                  <select
                                    id={`room-${room.roomConfigId}`}
                                    className="appearance-none bg-zinc-600 text-glacier-50 rounded border border-glacier-600 px-3 py-1.5 text-sm w-full sm:w-20 pr-8 focus:outline-none focus:ring-1 focus:ring-glacier-400"
                                    value={selectedRooms[room.roomConfigId] || 0}
                                    onChange={(e) =>
                                      handleSelectRoom(
                                        room.roomConfigId,
                                        parseInt(e.target.value)
                                      )
                                    }
                                  >
                                    <option value="0">0</option>
                                    {[...Array(
                                      Math.min(5, room.availableCount)
                                    )].map((_, i) => (
                                      <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-glacier-300">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>

                    <button
                      className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-md text-sm transition duration-300 ${
                        Object.values(selectedRooms).some((v) => v > 0)
                          ? "bg-glacier-500 hover:bg-glacier-600 text-white"
                          : "bg-glacier-800 text-glacier-400 cursor-not-allowed"
                      }`}
                      disabled={!Object.values(selectedRooms).some((v) => v > 0)}
                      onClick={handleReserveClick}
                    >
                      {dict.CLIENT.ACCOMMODATION.RESERVE_SELECTION}
                    </button>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm sm:text-base text-glacier-300">
                {dict.CLIENT.ACCOMMODATION.NO_AVAILABILITY}
              </p>
            )}
          </div>

          {/* Description & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="col-span-1 md:col-span-2 bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
              <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-3 sm:mb-4">
                {dict.CLIENT.ACCOMMODATION.DESCRIPTION_TITLE}
              </h2>
              <p className="text-sm sm:text-base text-glacier-100">
                {details.description}
              </p>
            </div>

            <div className="bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700">
              <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-3 sm:mb-4">
                {dict.CLIENT.ACCOMMODATION.CONTACT_INFO_TITLE}
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-glacier-100">
                  <span className="font-medium text-glacier-300">
                    {dict.CLIENT.ACCOMMODATION.ADDRESS_LABEL}:
                  </span>{" "}
                  {details.address}, {details.postalCode}
                </p>
                <p className="text-sm sm:text-base text-glacier-100">
                  <span className="font-medium text-glacier-300">
                    {dict.CLIENT.ACCOMMODATION.CITY_LABEL}:
                  </span>{" "}
                  {details.cityName}, {details.countryName}
                </p>
                <p className="text-sm sm:text-base text-glacier-100">
                  <span className="font-medium text-glacier-300">
                    {dict.CLIENT.ACCOMMODATION.PHONE_LABEL}:
                  </span>{" "}
                  {details.phoneNumber}
                </p>
                <p className="text-sm sm:text-base text-glacier-100">
                  <span className="font-medium text-glacier-300">
                    {dict.CLIENT.ACCOMMODATION.EMAIL_LABEL}:
                  </span>{" "}
                  {details.email}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="col-span-1 md:col-span-2 bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700 mt-4 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 border-b-2 border-glacier-500 pb-2 mb-3 sm:mb-4">
              {dict.CLIENT.ACCOMMODATION.AMENITIES_TITLE}
            </h2>

            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {details.amenities &&
                details.amenities
                  .replace(/"/g, "")
                  .split(",")
                  .map((amenity, index) => {
                    const trimmedAmenity = amenity.trim();
                    const translatedAmenity = dict.CLIENT.FILTERS.AMENITIES_OPTIONS[trimmedAmenity] || trimmedAmenity;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-1.5 sm:p-2 bg-zinc-600 rounded-md"
                      >
                        <div className="text-base sm:text-lg">
                          {getAmenityIcon(trimmedAmenity)}
                        </div>
                        <span className="text-xs sm:text-sm text-glacier-100">
                          {translatedAmenity}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Reviews Section */}
          <AccommodationReviews
            accommodationCode={details.code}
            accommodationType={details.accommodationType}
            className="mt-4 sm:mt-8"
          />
        </>
      )}
    </div>
  );
}
