import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import {
  AirplaneForm1VO,
  AirplaneForm2VO,
  AirplaneShowVO,
  AirplanesTypesFormVO,
  ChangeAirplaneStatusVO,
  CreateAirplanesTypesFormVO,
  CreateSeatConfigurationVO,
  SeatConfigurationVO,
} from "../types/airplane";
import { ResponseVO } from "@/types/common/response";
import { AddImageVO } from "@/types/common/image";
import { AirlineReducedVO } from "../../flights/types/common";

export async function getAllAirplanes(limit: number, page: number): Promise<ResponsePaginatedVO<AirplaneShowVO>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/all`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getAllAirplanesTypesEmun(): Promise<ResponseVO<[string]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/types/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getAllAirplanesStatus(): Promise<ResponseVO<[string]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/status/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAirplanesSeatClases(): Promise<ResponseVO<[string]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/seat-classes/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getAllAirplanesTypes(): Promise<ResponseVO<[AirplanesTypesFormVO]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/airplanes-types/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllSeatConfigurations(): Promise<ResponseVO<[SeatConfigurationVO]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/seat-configurations/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAirlines(): Promise<ResponseVO<[AirlineReducedVO]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/airlines/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createAirplanePart1(airplane: AirplaneForm1VO): Promise<ResponseVO<number>> {
  try {
    const response = await axiosClient.post("/admin/airplanes/create/part1", airplane);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createAirplanePart2(airplanes: AirplaneForm2VO[]): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airplanes/create/part2", airplanes);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}

export async function createAirplaneType(form: CreateAirplanesTypesFormVO): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airplanes/airplanes-types/create", form);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}

export async function createSeatConfiguration(form: CreateSeatConfigurationVO): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airplanes/seat-configuration/create", form);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}

export async function updateAirplaneStatus(form: ChangeAirplaneStatusVO): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airplanes/update/status", form);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}

export async function addImageOnAirplane(form: AddImageVO): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airplanes/add/image", form);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}
