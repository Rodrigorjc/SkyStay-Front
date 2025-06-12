import axiosClient from "@/lib/axiosClient";
import { ResponseVO } from "@/types/common/response";
import { AllDetailsFlightsVO, CabinFlightDetailsVO } from "../types/flight.details";
import { MealVO } from "@/app/[lang]/administration/meals/types/meal";

export async function getFlightDetails(code: string): Promise<ResponseVO<AllDetailsFlightsVO>> {
  try {
    const response = await axiosClient.get(`/flights/details/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCabinsByCode(flightCode: string): Promise<ResponseVO<CabinFlightDetailsVO[]>> {
  try {
    const response = await axiosClient.get(`/flights/cabins/${flightCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMealsByFlightCode(flightCode: string): Promise<ResponseVO<MealVO[]>> {
  try {
    const response = await axiosClient.get(`/flights/meals/${flightCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
