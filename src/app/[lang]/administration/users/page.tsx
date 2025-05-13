"use client";
import { useEffect, useState } from "react";
import { getAllUsers } from "./services/user.service";
import { UserAdminVO } from "@/types/admin/user";
import TableUser from "./components/TableUser";
import Loader from "@/app/components/ui/Loader";
import Pagination from "@/app/components/ui/Pagination";
import { useDictionary } from "@/app/context/DictionaryContext";

export default function AdminUsersPage() {
  const { dict } = useDictionary();

  const [users, setUsers] = useState<UserAdminVO[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers(20, page);
        setUsers(response.objects);
        setHasNextPage(response.hasNextPage);
        setHasPreviousPage(response.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
      <h1 className="text-2xl">{dict.ADMINISTRATION.SIDEBAR.USERS}</h1>
      <div className="bg-zinc-700 p-10 m-4 rounded-md">
        <TableUser users={users} />
        <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
