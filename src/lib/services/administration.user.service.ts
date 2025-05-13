import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { DecodeToken } from "@/types/common/decodeToken";
import { CityTableVO, CityVO } from "@/types/admin/city";

export async function getUserInfoByCode(userCode: string): Promise<DecodeToken> {
  try {
    const response = await axiosClient.get(`/admin/users/getInfo/${userCode}`);
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}

export async function getAllCities(): Promise<ResponsePaginatedVO<CityVO>> {
  try {
    const response = await axiosClient.get(`/admin/city/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getAllCitiesPaginated(limit: number, page: number): Promise<ResponsePaginatedVO<CityTableVO>> {
  try {
    const response = await axiosClient.get(`/admin/city/all/table`, {
      params: { limit, page },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
