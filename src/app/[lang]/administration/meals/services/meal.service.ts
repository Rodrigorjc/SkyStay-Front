import axiosClient from "@/lib/axiosClient";
import { ResponsePaginatedVO } from "@/types/common/responsePaginated";
import { ResponseVO } from "@/types/common/response";
import { MealTableVO, MealVO } from "../types/meal";

export async function getAllMeals(limit: number, page: number): Promise<ResponsePaginatedVO<MealTableVO>> {
  try {
    const response = await axiosClient.get(`/admin/meal/all`, {
      params: { limit, page },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createMeal(form: MealVO): Promise<ResponseVO<void>> {
  try {
    const response = await axiosClient.post(`/admin/meal/create`, form);
    return response.data;
  } catch (error) {
    throw error;
  }
}
