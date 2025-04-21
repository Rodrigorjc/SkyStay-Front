import { DecodeToken } from "@/types/common/decodeToken";
import axiosClient from "../axiosClient";
import { cookies } from "next/headers";

export async function decodeToken(): Promise<DecodeToken | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  if (!token) {
    return null;
  }

  try {
    const response = await axiosClient.get("/auth/decode-token", {});
    return response.data;
  } catch (error) {
    throw error;
  }
}
