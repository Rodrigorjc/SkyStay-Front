"use client";

import Button from "@/app/components/ui/Button";
import { useDictionary, useLanguage } from "@context";
import { UserAdminVO } from "@/types/admin/user";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";

interface AdminUsersTableProps {
  users: UserAdminVO[];
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const { dict } = useDictionary();
  const lang = useLanguage();
  const router = useRouter();
  return (
    <div>
      <section>
        <div className="flex flex-row gap-6 items-end">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              id="search-bar"
              placeholder={dict.ADMINISTRATION.USERS.SEARCH_BAR}
              className="w-full px-4 py-2 pr-12 rounded-2xl border border-glacier-500 bg-glacier-700/40 text-white placeholder-glacier-300 focus:outline-none focus:ring-2 focus:ring-glacier-400/70 transition-all shadow-sm"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-glacier-300 hover:text-white transition-colors" aria-label="Search">
              <FaMagnifyingGlass className="w-5 h-5" />
            </button>
          </div>

          <div className="flex w-auto">
            <Button text={dict.ADMINISTRATION.USERS.RESET_FILTER} onClick={() => console.log("Reset filters")} color="admin" className="" />
          </div>
        </div>

        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.USERS.USER_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.LAST_NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.EMAIL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.NIF}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.PHONE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.ROLE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.DETAILED_INFORMATION}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.userCode} isOdd={index % 2 === 0}>
                  <TableCell>{user.userCode}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.nif}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.rol.replace(/^ROLE_/, "")}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      text={dict.ADMINISTRATION.SHOW}
                      onClick={e => {
                        if (user.rol === "ROLE_ADMIN" || user.rol === "ROLE_MODERATOR") {
                          e.preventDefault();
                        } else {
                          router.push(`/${lang}/administration/users/${user.userCode}`);
                        }
                      }}
                      color="light"
                      className={`button w-fit ${user.rol === "ROLE_ADMIN" || user.rol === "ROLE_MODERATOR" ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
