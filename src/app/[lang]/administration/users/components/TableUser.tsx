"use client";

import Button from "@/app/components/ui/Button";
import { useDictionary } from "@context";
import { UserAdminVO } from "@/types/admin/user";
import { useRouter } from "next/navigation";

interface AdminUsersTableProps {
  users: UserAdminVO[];
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const { dict } = useDictionary();
  const router = useRouter();
  return (
    <div>
      <section>
        <div className="flex flex-row gap-4 items-end">
          <div className="flex flex-col w-3/5 gap-2">
            <label htmlFor="search-bar" className="mb-1">
              {dict.ADMINISTRATION.USERS.SEARCH_BAR}:
            </label>
            <input type="text" id="search-bar" className="border border-white rounded-md px-5 py-2" />
          </div>

          <div className="flex w-auto">
            <Button text={dict.ADMINISTRATION.USERS.RESET_FILTER} onClick={() => console.log("Reset filters")} color="light" className="button w-full items-end" />
          </div>
        </div>

        <div className="mt-10 overflow-auto">
          <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="text-bold text-justify text-base">
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.USER_CODE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.NAME}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.LAST_NAME}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.EMAIL}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.NIF}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.PHONE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.ROLE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600">{dict.ADMINISTRATION.USERS.DETAILED_INFORMATION}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userCode} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{user.userCode}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.lastName}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.nif}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                  <td className="border border-gray-300 px-4 py-2"> {user.rol.replace(/^ROLE_/, "")}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Button
                      text={dict.ADMINISTRATION.USERS.SHOW}
                      onClick={e => {
                        if (user.rol === "ROLE_ADMIN") {
                          e.preventDefault();
                        } else {
                          router.push(`/es/administration/users/${user.userCode}`);
                        }
                      }}
                      color="light"
                      className={`button w-fit ${user.rol === "ROLE_ADMIN" ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
