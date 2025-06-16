"use client";
import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "./services/user.service";
import { UserAdminVO } from "@/types/admin/user";
import TableUser from "./components/TableUser";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";
import { Title } from "../components/Title";

export default function AdminUsersPage() {
  const { dict } = useDictionary();

  const [users, setUsers] = useState<UserAdminVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllUsers(20, page, search);
      setUsers(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      return (
        <div className="flex items-center justify-center min-h-screen w-full">
          <h1 className="text-2xl">{dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE}</h1>
        </div>
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE]);

  useEffect(() => {
    fetchUsers();
  }, [page, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleReset = () => {
    setSearch("");
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Title title={dict.ADMINISTRATION.SIDEBAR.USERS} />
      <div className="p-1 m-4">
        <TableUser users={users} onSearch={handleSearch} searchValue={search} onReset={handleReset} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
