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
    <div className="flex h-screen bg-zinc-800">
      <Sidebar dict={dict} />
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
