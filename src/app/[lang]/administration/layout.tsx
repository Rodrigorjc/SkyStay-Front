"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "@/app/[lang]/administration/components/AdminSidebar";
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
          router.replace(`/${lang}/forbidden`);
        }
      } catch (error) {
        router.replace(`/${lang}/forbidden`);
      }
    };
    fetchUserInfo();
  }, []);

  if (!dict || !user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar dict={dict} user={user} />
      <div className="flex-1 p-4 bg-zinc-800 overflow-y-auto custom-scrollbar">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
