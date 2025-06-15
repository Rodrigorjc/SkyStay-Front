import { ResponseVO } from "@/types/common/response";
import { FlightPurchaseVO } from "../types/purchase.ticket";
import axiosClient from "@/lib/axiosClient";

export async function purchaseTicketsFlight(form: FlightPurchaseVO[], flightCode: string, lang: string): Promise<ResponseVO<string>> {
  try {
    const response = await axiosClient.post(`/flights/purchase/${flightCode}?language=${lang}`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}
