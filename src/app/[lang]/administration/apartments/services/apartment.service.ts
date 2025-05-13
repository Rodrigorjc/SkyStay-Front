import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { EditHotelVO, HotelFormVO, HotelVO, ShowHotelDetails } from "../../hotels/types/hotel";
import { AddImageVO } from "@/types/common/image";
import { ResponseVO } from "@/types/common/response";
import { AddRoomImageVO } from "../types/apartment";

export async function getAllApartments(limit: number, page: number): Promise<ResponsePaginatedVO<HotelVO>> {
  try {
    const response = await axiosClient.get(`/admin/apartments/all`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addImageApartment(form: AddImageVO): Promise<string> {
  try {
    const response = await axiosClient.post(`/admin/apartments/add/image`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createApartment(form: HotelFormVO): Promise<HotelVO> {
  try {
    const response = await axiosClient.post(`/admin/apartments/add`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getApartmentByCode(code: string): Promise<ResponseVO<ShowHotelDetails>> {
  try {
    const response = await axiosClient.get(`/admin/apartments/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateApartments(form: EditHotelVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/apartments/update`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addRoomImage(form: AddRoomImageVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/apartments/add-image/room`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}
