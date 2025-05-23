"use client";

import { useState, useEffect, JSX } from "react";
import { FaBars, FaChevronLeft, FaHome, FaUser, FaPlaneDeparture, FaHotel, FaBuilding, FaSuitcase, FaBook, FaCreditCard, FaChartPie, FaLifeRing, FaPlane } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { PiLighthouse } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { decodeToken } from "@/lib/services/common.service";
import { DecodeToken } from "@/types/common/decodeToken";

const ROUTES = [
  { icon: <FaHome />, textKey: "HOME", url: "/administration" },
  { icon: <FaUser />, textKey: "USERS", url: "/administration/users" },
  { icon: <FaPlaneDeparture />, textKey: "FLIGHTS", url: "/administration/flights" },
  { icon: <PiLighthouse />, textKey: "AIRPORTS", url: "/administration/airports" },
  { icon: <FaPlane />, textKey: "AIRPLANES", url: "/administration/airplanes" },
  { icon: <FaHotel />, textKey: "HOTELS", url: "/administration/hotels" },
  { icon: <FaBuilding />, textKey: "APARTMENTS", url: "/administration/apartments" },
  { icon: <FaLifeRing />, textKey: "SUPPORT", url: "/administration/support" },
];

const Sidebar = ({ dict }: { dict: any }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState<DecodeToken | null>(null);
  const pathname = usePathname();
  const lang = window.location.pathname.includes("/en") ? "en" : "es";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await decodeToken();
        setUser(response);
      } catch (error) {
        console.error("Error fetching user info: ", error);
      }
    };
    fetchUserInfo();
  }, []);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <div className={`h-screen bg-glacier-500 text-white flex flex-col p-4 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <nav className="flex-1">
        <ul className="space-y-5">
          {ROUTES.map(({ icon, textKey, url }) => (
            <SidebarItem key={textKey} icon={icon} text={dict.ADMINISTRATION.SIDEBAR[textKey]} url={`/${lang}${url}`} collapsed={collapsed} currentPath={pathname} />
          ))}
        </ul>
      </nav>
      <SidebarFooter collapsed={collapsed} user={user} />
    </div>
  );
};

const SidebarHeader = ({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) => (
  <div className={`mb-2 gap-4 ${collapsed ? "flex justify-center" : "flex items-center justify-between"}`}>
    {!collapsed && <h1 className="flex items-center text-2xl font-bold">SkyStay</h1>}
    <button onClick={toggleSidebar} className="text-white text-xl">
      {collapsed ? <FaBars /> : <FaChevronLeft />}
    </button>
  </div>
);

const SidebarItem = ({ icon, text, url, collapsed, currentPath }: { icon?: JSX.Element; text: string; url: string; collapsed: boolean; currentPath: string }) => {
  const isActive = url === currentPath;

  return (
    <Link href={url}>
      <li
        title={text}
        className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 my-4
        ${collapsed ? "flex justify-center" : "flex items-center justify-between"} 
        ${isActive ? "bg-glacier-700 hover:bg-glacier-800" : "hover:bg-gray-800"}`}>
        <p className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}>
          {icon && <span className="text-lg">{icon}</span>}
          {!collapsed && <span>{text}</span>}
        </p>
      </li>
    </Link>
  );
};

const SidebarFooter = ({ collapsed, user }: { collapsed: boolean; user: DecodeToken | null }) => (
  <div className={`mt-6 flex ${collapsed ? "justify-center" : "items-center space-x-3"}`}>
    <RiAdminFill className="h-10 w-10 rounded-full text-[#FFD580]" />
    {!collapsed && user && (
      <div className="flex flex-col">
        <p className="text-base font-medium">{user.name}</p>
        <p className="text-sm text-gray-300">{user.role}</p>
      </div>
    )}
  </div>
);

export default Sidebar;
