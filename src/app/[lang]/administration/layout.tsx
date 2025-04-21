"use client";
import React, { ReactNode } from "react";
import Sidebar from "@components/AdminSidebar";
import { useDictionary } from "@context";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { dict } = useDictionary();

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
