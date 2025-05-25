import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { ResponseVO } from "@/types/common/response";
import { AdditionalBaggageTableVO, AdditionalBaggageVO } from "../types/additional-baggage";

export async function getAllAdditionalBaggages(limit: number, page: number): Promise<ResponsePaginatedVO<AdditionalBaggageTableVO>> {
  try {
    const response = await axiosClient.get(`/admin/additional-baggage/all`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createAdditionalBaggage(form: AdditionalBaggageVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/additional-baggage/create`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}
