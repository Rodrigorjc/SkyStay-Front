import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { ResponseVO } from "@/types/common/response";
import { FlightFormVO, FlightsTableVO } from "../types/flight";
import { FlightsDetailsVO } from "../[flightsCode]/types/detailsFlight";
import { AirlineReducedVO, AirplaneReducedVO } from "../types/common";

export async function getAllFlights(limit: number, page: number): Promise<ResponsePaginatedVO<FlightsTableVO>> {
  try {
    const response = await axiosClient.get(`/admin/flights/all`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getFlightByCode(code: string): Promise<ResponseVO<FlightsDetailsVO>> {
  try {
    const response = await axiosClient.get(`/admin/flights/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createFlight(form: FlightFormVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/flights/create`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAirlinesReduced(limit: number, page: number): Promise<ResponsePaginatedVO<AirlineReducedVO>> {
  try {
    const response = await axiosClient.get(`/admin/airline/all/reduced`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAirportsReduced(limit: number, page: number): Promise<ResponsePaginatedVO<AirlineReducedVO>> {
  try {
    const response = await axiosClient.get(`/admin/airports/all/reduced`, {
      params: { limit, page },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAirplanesReduced(limit: number, page: number): Promise<ResponsePaginatedVO<AirplaneReducedVO>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/all/reduced`, {
      params: { limit, page },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
