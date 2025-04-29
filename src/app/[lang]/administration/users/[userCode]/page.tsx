"use client";

import { MdArrowBack } from "react-icons/md";
import { useDictionary } from "@context";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/ui/Pagination";
import { useEffect, useState } from "react";
import { getAirlaneRating, getApartmentRating, getHotelRating, getOrderApartment, getOrderFlight, getOrderHotel, getUserInfoByCode } from "@/lib/services/administration.user.service";
import React from "react";
import { HotelRatingVO } from "@/types/admin/hotelRating";
import TableHotelRating from "./components/TableHotelRating";
import { ApartmentRatingVO } from "@/types/admin/apartmentRating";
import TableApartmentRating from "./components/TableApartmentRating";
import TableAirlineRating from "./components/TableAirlaneRating";
import { AirlineRatingVO } from "@/types/admin/airlineRating";
import { UserInfoVO } from "@/types/admin/userInfo";
import { OrderApartmentVO } from "@/types/admin/orderApartment";
import { OrderHotelVO } from "@/types/admin/orderHotel";
import { OrderFlightVO } from "@/types/admin/orderFlight";
import TableOrderApartment from "./components/TableOrderApartment";
import TableOrderHotel from "./components/TableOrderHotel";
import TableOrderFlight from "./components/TableOrderFlight";

export default function AdminUserDetails({ params }: { params: Promise<{ userCode: string }> }) {
  const { dict } = useDictionary();
  const { userCode } = React.use(params);
  const router = useRouter();

  const [dataUser, setDataUser] = useState<UserInfoVO>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfoByCode(userCode);
        setDataUser(response);
      } catch (error) {
        console.error("Error fetching user info by code:  ", error);
      }
    };
    fetchUserInfo();
  }, [userCode]);

  // Maneja la paginación y la obtención de todas las valoraciones de aerolíneas según el usuario.
  // Actualiza los datos y el estado de navegación al cambiar la página o el usuario.
  const [dataAirlaneRating, setdataAirlaneRating] = useState<AirlineRatingVO[]>([]);
  const [pageAirlaneRating, setPageAirlaneRating] = useState(1);
  const [hasNextPageAirlaneRating, setHasNextPageAirlaneRating] = useState(false);
  const [hasPreviousPageAirlaneRating, setHasPreviousPageAirlaneRating] = useState(false);

  useEffect(() => {
    const fetchAirlaneRating = async () => {
      try {
        const response = await getAirlaneRating(20, pageAirlaneRating, userCode);
        setdataAirlaneRating(response.objects);
        setHasNextPageAirlaneRating(response.hasNextPage);
        setHasPreviousPageAirlaneRating(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching airlanes ratings by user: ", error);
      }
    };

    fetchAirlaneRating();
  }, [pageAirlaneRating, userCode]);

  const handlePageChangeAirlaneRating = (newPage: number) => {
    setPageAirlaneRating(newPage);
  };

  // Maneja la paginación y la obtención de todas las valoraciones de hoteles según el usuario.
  // Actualiza los datos y el estado de navegación al cambiar la página o el usuario.

  const [dataHotelRating, setDataHotelRating] = useState<HotelRatingVO[]>([]);
  const [pageHotelRating, setPageHotelRating] = useState(1);
  const [hasNextPageHotelRating, setHasNextPageHotelRating] = useState(false);
  const [hasPreviousPageHotelRating, setHasPreviousPageHotelRating] = useState(false);

  useEffect(() => {
    const fetchHotelRating = async () => {
      try {
        const response = await getHotelRating(20, pageHotelRating, userCode);
        setDataHotelRating(response.objects);
        setHasNextPageHotelRating(response.hasNextPage);
        setHasPreviousPageHotelRating(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching hotel ratings by user: ", error);
      }
    };

    fetchHotelRating();
  }, [pageHotelRating, userCode]);

  const handlePageChangeHotelRating = (newPage: number) => {
    setPageHotelRating(newPage);
  };

  // Maneja la paginación y la obtención de todas las valoraciones de apartamentos según el usuario.
  // Actualiza los datos y el estado de navegación al cambiar la página o el usuario.

  const [dataApartmentRating, setDataApartmentRating] = useState<ApartmentRatingVO[]>([]);
  const [pageApartmentRating, setPageApartmentRating] = useState(1);
  const [hasNextPageApartmentRating, setHasNextPageApartmentRating] = useState(false);
  const [hasPreviousPageApartmentRating, setHasPreviousPageApartmentRating] = useState(false);

  useEffect(() => {
    const fetchApartmentRating = async () => {
      try {
        const response = await getApartmentRating(20, pageApartmentRating, userCode);
        setDataApartmentRating(response.objects);
        setHasNextPageApartmentRating(response.hasNextPage);
        setHasPreviousPageApartmentRating(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching apartment ratings by user: ", error);
      }
    };

    fetchApartmentRating();
  }, [pageApartmentRating, userCode]);

  const handlePageChangeApartmentRating = (newPage: number) => {
    setPageApartmentRating(newPage);
  };

  // Maneja la paginación y la obtención de todas los pedidos en apartamentos realizados por el usuario.
  // Actualiza los datos y el estado de navegación al cambiar la página o el usuario.
  const [dataOrderApartment, setDataOrderApartment] = useState<OrderApartmentVO[]>([]);
  const [pageOrderApartment, setPageOrderApartment] = useState(1);
  const [hasNextPageOrderApartment, setHasNextPageOrderApartment] = useState(false);
  const [hasPreviousPageOrderApartment, setHasPreviousPageOrderApartment] = useState(false);

  useEffect(() => {
    const fetchOrderApartment = async () => {
      try {
        const response = await getOrderApartment(20, pageOrderApartment, userCode);
        setDataOrderApartment(response.objects);
        setHasNextPageOrderApartment(response.hasNextPage);
        setHasPreviousPageOrderApartment(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching apartment orders by user: ", error);
      }
    };

    fetchOrderApartment();
  }, [pageOrderApartment, userCode]);

  const handlePageChangeOrderApartment = (newPage: number) => {
    setPageOrderApartment(newPage);
  };

  // Maneja la paginación y la obtención de todas los pedidos en hoteles realizados por el usuario.
  // Actualiza los datos y el estado de navegación al cambiar la página o el usuario.
  const [dataOrderHotel, setDataOrderHotel] = useState<OrderHotelVO[]>([]);
  const [pageOrderHotel, setPageOrderHotel] = useState(1);
  const [hasNextPageOrderHotel, setHasNextPageOrderHotel] = useState(false);
  const [hasPreviousPageOrderHotel, setHasPreviousPageOrderHotel] = useState(false);

  useEffect(() => {
    const fetchOrderHotel = async () => {
      try {
        const response = await getOrderHotel(20, pageOrderHotel, userCode);
        setDataOrderHotel(response.objects);
        setHasNextPageOrderHotel(response.hasNextPage);
        setHasPreviousPageOrderHotel(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching hotel orders by user: ", error);
      }
    };

    fetchOrderHotel();
  }, [pageOrderHotel, userCode]);

  const handlePageChangeOrderHotel = (newPage: number) => {
    setPageOrderHotel(newPage);
  };

  // Maneja la paginación y la obtención de todas los billetes de vuelos realizados por el usuario.
  // Actualiza los datos y el estado de navegación al cambiar la página o el usuario.
  const [dataOrderFlight, setDataOrderFlight] = useState<OrderFlightVO[]>([]);
  const [pageOrderFlight, setPageOrderFlight] = useState(1);
  const [hasNextPageOrderFlight, setHasNextPageOrderFlight] = useState(false);
  const [hasPreviousPageOrderFlight, setHasPreviousPageOrderFlight] = useState(false);

  useEffect(() => {
    const fetchOrderFlight = async () => {
      try {
        const response = await getOrderFlight(20, pageOrderFlight, userCode);
        setDataOrderFlight(response.objects);
        setHasNextPageOrderFlight(response.hasNextPage);
        setHasPreviousPageOrderFlight(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching flight orders by user: ", error);
      }
    };

    fetchOrderFlight();
  }, [pageOrderFlight, userCode]);

  const handlePageChangeOrderFlight = (newPage: number) => {
    setPageOrderFlight(newPage);
  };

  return (
    <div>
      <section>
        <div>
          <button onClick={() => router.push(`/es/administration/users`)} className="flex flex-row gap-2 items-center justify-start">
            <MdArrowBack className="text-3xl" />
            <h1 className="text-2xl">{dict.ADMINISTRATION.USERS.DETAILS.USER_DETAILS}</h1>
          </button>
        </div>
        <div>
          <div className="bg-zinc-700 p-10 m-4 rounded-md">
            <div className="text-2xl font-semibold text-glacier-300 flex flex-row gap-4">
              <h1>
                {dict.ADMINISTRATION.USERS.DETAILS.USER}: <span className="text-xl text-glacier-200">{dataUser?.name}</span>
              </h1>
              <h1>
                {dict.ADMINISTRATION.USERS.DETAILS.ROLE}: <span className="text-xl text-glacier-200">{dataUser?.role}</span>
              </h1>
            </div>

            <TableAirlineRating data={dataAirlaneRating} />
            <Pagination page={pageAirlaneRating} hasNextPage={hasNextPageAirlaneRating} hasPreviousPage={hasPreviousPageAirlaneRating} onPageChange={handlePageChangeAirlaneRating} />

            <TableApartmentRating data={dataApartmentRating} />
            <Pagination page={pageApartmentRating} hasNextPage={hasNextPageApartmentRating} hasPreviousPage={hasPreviousPageApartmentRating} onPageChange={handlePageChangeApartmentRating} />

            <TableHotelRating data={dataHotelRating} />
            <Pagination page={pageHotelRating} hasNextPage={hasNextPageHotelRating} hasPreviousPage={hasPreviousPageHotelRating} onPageChange={handlePageChangeHotelRating} />

            <TableOrderFlight data={dataOrderFlight} />
            <Pagination page={pageOrderFlight} hasNextPage={hasNextPageOrderFlight} hasPreviousPage={hasPreviousPageOrderFlight} onPageChange={handlePageChangeOrderFlight} />

            <TableOrderApartment data={dataOrderApartment} />
            <Pagination page={pageOrderApartment} hasNextPage={hasNextPageOrderApartment} hasPreviousPage={hasPreviousPageOrderApartment} onPageChange={handlePageChangeOrderApartment} />

            <div className="mb-2">
              <TableOrderHotel data={dataOrderHotel} />
              <Pagination page={pageOrderHotel} hasNextPage={hasNextPageOrderHotel} hasPreviousPage={hasPreviousPageOrderHotel} onPageChange={handlePageChangeOrderHotel} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
