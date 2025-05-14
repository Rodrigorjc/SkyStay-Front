import axiosClient from "@/lib/axiosClient";
import { AirplaneAllCodeVO, Cabin } from "../types/airplane.info";

export async function getBasicInfoByCode(airplaneCode: string): Promise<AirplaneAllCodeVO> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/basic-info/${airplaneCode}`);
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}

export async function getCabinsWithSeatsByAirplaneCode(airplaneCode: string): Promise<Cabin[]> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/cabins/${airplaneCode}`);
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}
