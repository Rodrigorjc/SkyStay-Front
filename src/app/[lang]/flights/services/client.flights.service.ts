import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import axiosClient from "@/lib/axiosClient";
import { FlightClientVO } from "../types/flight";

export async function getAllFlights(
  limit: number,
  page: number,
  filters?: {
    origin?: string;
    destination?: string;
    airline?: string;
    price?: number;
  }
): Promise<ResponsePaginatedVO<FlightClientVO>> {
  try {
    const params: any = { limit, page };
    if (filters) {
      if (filters.origin) params.origin = filters.origin;
      if (filters.destination) params.destination = filters.destination;
      if (filters.airline) params.airline = filters.airline;
      if (typeof filters.price === "number" && !isNaN(filters.price)) params.price = filters.price;
    }
    const response = await axiosClient.get(`/flights/all`, {
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
