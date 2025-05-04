import axiosClient from "@/lib/axiosClient";
import { AirlineRatingVO } from "@/types/admin/airlineRating";
import { HotelRatingVO } from "@/types/admin/hotelRating";
import { ApartmentRatingVO } from "@/types/admin/apartmentRating";
import { UserAdminVO } from "@/types/admin/user";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { UserInfoVO } from "@/types/admin/userInfo";
import { OrderApartmentVO } from "@/types/admin/orderApartment";
import { OrderFlightVO } from "@/types/admin/orderFlight";
import { OrderHotelVO } from "@/types/admin/orderHotel";
import { AirportAdminVO } from "@/types/admin/airport";
import { CityVO } from "@/types/admin/city";
import { ResponseVO } from "@/types/common/response";
import { AirportForm, AirportFormEdit } from "@/types/admin/form";
import {
  AddImageAirplaneVO,
  AirplaneForm1VO,
  AirplaneForm2VO,
  AirplaneShowVO,
  AirplanesTypesFormVO,
  ChangeAirplaneStatusVO,
  CreateAirplanesTypesFormVO,
  CreateSeatConfigurationVO,
  SeatConfigurationVO,
} from "@/app/[lang]/administration/airplanes/types/airplane";

export async function getAllUsers(limit: number, page: number): Promise<ResponsePaginatedVO<UserAdminVO>> {
  try {
    const response = await axiosClient.get("/admin/users/all", {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAirlaneRating(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<AirlineRatingVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/airline-ratings`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getHotelRating(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<HotelRatingVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/hotel-ratings`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getApartmentRating(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<ApartmentRatingVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/apartment-ratings`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderApartment(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<OrderApartmentVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/order-apartments`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderHotel(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<OrderHotelVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/order-hotels`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderFlight(limit: number, page: number, userCode: string): Promise<ResponsePaginatedVO<OrderFlightVO>> {
  try {
    const response = await axiosClient.get(`/admin/users/${userCode}/order-flights`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserInfoByCode(userCode: string): Promise<UserInfoVO> {
  try {
    const response = await axiosClient.get(`/admin/users/getInfo/${userCode}`);
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}

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

export async function getAllCities(): Promise<CityVO[]> {
  try {
    const response = await axiosClient.get(`/admin/city/all`);
    return response.data.response.objects;
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

export async function getAllSeatConfigurations(): Promise<ResponseVO<[SeatConfigurationVO]>> {
  try {
    const response = await axiosClient.get(`/admin/airplanes/seat-configurations/all`);
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

export async function addImageOnAirplane(form: AddImageAirplaneVO): Promise<string> {
  try {
    const response = await axiosClient.post("/admin/airplanes/add/image", form);
    return response.data.response.message;
  } catch (error) {
    throw error;
  }
}
