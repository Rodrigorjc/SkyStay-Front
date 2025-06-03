import axiosClient from "@/lib/axiosClient";
import { ResponseVO } from "@/types/common/response";
import { CityImageVO } from "@/types/home/city";

export async function getLast5Flights(): Promise<ResponseVO<CityImageVO[]>> {
  const response = await axiosClient.get("/home/list-five-citys");
  return response.data;
}
