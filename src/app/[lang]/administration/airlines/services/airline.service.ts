import axiosClient from "@/lib/axiosClient";
import { ResponseVO } from "@/types/common/response";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { AirlineAddImageVO, AirlineAddVO, AirlineEditVO, AirlineTableVO } from "../types/airline";

export async function getAllAirlines(limit: number, page: number): Promise<ResponsePaginatedVO<AirlineTableVO>> {
  try {
    const response = await axiosClient.get(`/admin/airline/all`, {
      params: { limit, page },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createAirline(form: AirlineAddVO): Promise<ResponseVO<string>> {
  try {
    const response = await axiosClient.post(`/admin/airline/add`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addAirlineImage(form: AirlineAddImageVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/airline/add/image`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function editAirline(form: AirlineEditVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/airline/edit`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}
