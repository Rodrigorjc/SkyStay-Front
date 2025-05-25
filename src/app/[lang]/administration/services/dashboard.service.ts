import axiosClient from "@/lib/axiosClient";
import { ResponseVO } from "@/types/common/response";
import { UserAdminVO } from "@/types/admin/user";
import { FlightsDetailsVO } from "../flights/[flightsCode]/types/detailsFlight";

// Obtener ingresos totales
export async function getTotalRevenue(): Promise<ResponseVO<number>> {
  const response = await axiosClient.get("/admin/dashboard/total-revenue");
  return response.data;
}

// Obtener los últimos 5 usuarios
export async function getLast5Users(): Promise<ResponseVO<UserAdminVO[]>> {
  const response = await axiosClient.get("/admin/dashboard/last-users");
  return response.data;
}

// Obtener los últimos 5 vuelos
export async function getLast5Flights(): Promise<ResponseVO<FlightsDetailsVO[]>> {
  const response = await axiosClient.get("/admin/dashboard/last-flights");
  return response.data;
}

// Obtener total de vuelos activos
export async function getTotalFlightsActive(): Promise<ResponseVO<number>> {
  const response = await axiosClient.get("/admin/dashboard/total-flights-active");
  return response.data;
}

// Obtener total de cuentas de usuario
export async function getTotalUsersAccounts(): Promise<ResponseVO<number>> {
  const response = await axiosClient.get("/admin/dashboard/total-users");
  return response.data;
}
