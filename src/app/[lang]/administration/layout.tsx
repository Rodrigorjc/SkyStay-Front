"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "@components/AdminSidebar";
import { useDictionary } from "@context";
import { decodeToken } from "@/lib/services/common.service";
import { useParams, useRouter } from "next/navigation";
import { DecodeToken } from "@/types/common/decodeToken";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { dict } = useDictionary();
  const router = useRouter();
  const [user, setUser] = useState<DecodeToken | null>(null);

  const params = useParams();
  const lang = params.lang;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await decodeToken();
        setUser(response);

        if (!response) {
          throw new Error("Token decoding failed: response is null");
        }

        if (!["ADMIN", "MODERATOR"].includes(response.role)) {
          router.push(`/${lang}/unauthorized`);
        }
      } catch (error) {
        console.error("Error fetching user info by code: ", error);
        router.push(`/${lang}/login`);
      }
    };
    fetchUserInfo();
  }, [router]);

  if (!dict) {
    return;
  }

  return (
    <div className="flex h-screen">
      <Sidebar dict={dict} />
      <div className="flex-1 p-4 bg-zinc-800 overflow-y-auto custom-scrollbar">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
