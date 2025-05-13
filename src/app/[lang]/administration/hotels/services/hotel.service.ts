import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { AddRoomImageVO, EditHotelVO, HotelFormVO, HotelVO, RoomConfigurationVO, ShowHotelDetails } from "../types/hotel";
import { AddImageVO } from "@/types/common/image";
import { ResponseVO } from "@/types/common/response";

export async function getAllHotels(limit: number, page: number): Promise<ResponsePaginatedVO<HotelVO>> {
  try {
    const response = await axiosClient.get(`/admin/hotels/all`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addImageHotel(form: AddImageVO): Promise<string> {
  try {
    const response = await axiosClient.post(`/admin/hotels/add/image`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllRoomType(): Promise<ResponseVO<[string]>> {
  try {
    const response = await axiosClient.get(`/admin/hotels/rooms/type/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getAllRoomConfigurations(): Promise<ResponseVO<[RoomConfigurationVO]>> {
  try {
    const response = await axiosClient.get(`/admin/hotels/rooms-configuration/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createHotel(form: HotelFormVO): Promise<HotelVO> {
  try {
    const response = await axiosClient.post(`/admin/hotels/add`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getHotelByCode(code: string): Promise<ResponseVO<ShowHotelDetails>> {
  try {
    const response = await axiosClient.get(`/admin/hotels/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addRoomImage(form: AddRoomImageVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/hotels/add-image/room`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateHotel(form: EditHotelVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/hotels/update`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}
