import { ResponseVO } from "@/types/common/response";
import { UserAdminVO } from "@/types/admin/user";

const url = "http://localhost:8080/admin/users/";

export async function getAllUsers(limit: number, page: number): Promise<ResponseVO<UserAdminVO[]>> {
  const res = await fetch(`${{ url }}/all/?limit=${limit}&page=${page}`);

  if (!res.ok) {
    throw new Error("Error al obtener los usuarios");
  }

  const data: ResponseVO<UserAdminVO[]> = await res.json();
  return data;
}
