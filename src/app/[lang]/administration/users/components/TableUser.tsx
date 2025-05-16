"use client";

import Button from "@/app/components/ui/Button";
import { useDictionary, useLanguage } from "@context";
import { UserAdminVO } from "@/types/admin/user";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { useEffect, useState } from "react";
import { SearchBar } from "@/app/components/ui/admin/SearchBar";

interface AdminUsersTableProps {
  users: UserAdminVO[];
  onSearch: (value: string) => void;
  searchValue: string;
  onReset: () => void;
}

export default function AdminUsersTable({ users, onSearch, searchValue, onReset }: AdminUsersTableProps) {
  const { dict } = useDictionary();
  const lang = useLanguage();
  const router = useRouter();

  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div>
      <section>
        <div className="flex flex-row gap-6 items-end">
          <SearchBar id="find-user" placeholder={dict.ADMINISTRATION.USERS.SEARCH_BAR} value={inputValue} onChange={handleInputChange} onSearch={handleSearchClick} onKeyDown={handleKeyDown} />

          <div className="flex w-auto">
            <Button text={dict.ADMINISTRATION.USERS.RESET_FILTER} onClick={() => onReset()} color="admin" className="" />
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
