import axiosClient from "@/lib/axiosClient";
import { UserAdminVO } from "@/types/admin/user";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { AirlineRatingVO, ApartmentRatingVO, HotelRatingVO } from "../[userCode]/types/rating";
import { OrderApartmentVO, OrderFlightVO, OrderHotelVO } from "../[userCode]/types/order";

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
