import { DecodeToken } from "@/types/common/decodeToken";
import axiosClient from "../axiosClient";

export async function decodeToken(): Promise<DecodeToken | null> {
  try {
    const response = await axiosClient.get("/auth/decode-token", {});
    return response.data.response.objects;
  } catch (error) {
    throw error;
  }
}
