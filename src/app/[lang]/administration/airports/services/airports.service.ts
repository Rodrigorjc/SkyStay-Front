import axiosClient from "@/lib/axiosClient";
import { AirportAdminVO, AirportForm, AirportFormEdit } from "../types/airport";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";

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
