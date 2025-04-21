import axiosClient from "@/lib/axiosClient";
import { AirlineRatingVO } from "@/types/admin/airlineRating";
import { HotelRatingVO } from "@/types/admin/hotelRating";
import { ApartmentRatingVO } from "@/types/admin/apartmentRating";
import { UserAdminVO } from "@/types/admin/user";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { UserInfoVO } from "@/types/admin/userInfo";
import { OrderApartmentVO } from "@/types/admin/orderApartment";
import { OrderFlightVO } from "@/types/admin/orderFlight";
import { OrderHotelVO } from "@/types/admin/orderHotel";
import { AirportAdminVO } from "@/types/admin/airport";
import { CityVO } from "@/types/admin/city";
import { ResponseVO } from "@/types/common/response";
import { AirportForm, AirportFormEdit } from "@/types/admin/form";

export async function getAllUsers(limit: number, page: number): Promise<ResponsePaginatedVO<UserAdminVO>> {
  try {
    const response = await axiosClient.get("/admin/users/all", {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAirlaneRating(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<AirlineRatingVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/airline-ratings`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getHotelRating(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<HotelRatingVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/hotel-ratings`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getApartmentRating(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<ApartmentRatingVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/apartment-ratings`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderApartment(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<OrderApartmentVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/order-apartments`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderHotel(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<OrderHotelVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/order-hotels`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderFlight(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<OrderFlightVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/order-flights`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserInfoByCode(userCode: string): Promise<UserInfoVO> {
  try {
    const response = await axiosClient.get(`/admin/user/getInfo/${userCode}`);
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}

export async function getAllAirports(limit: number, page: number): Promise<ResponsePaginatedVO<AirportAdminVO>> {
  try {
    const response = await axiosClient.get("/admin/airports/all", {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllCities(): Promise<CityVO[]> {
  try {
    const response = await axiosClient.get(`/admin/city/all`);
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}

export async function createAirport(airportForm: AirportForm): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airports/create", airportForm);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}

export async function updateAirport(airportForm: AirportFormEdit): Promise<string> {
  try {
    const response = await axiosClient.put(`/admin/airports/update/${airportForm.code}`, airportForm);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}
