"use client";

import { useState, useEffect, JSX } from "react";
import { FaBars, FaChevronLeft, FaHome, FaUser, FaPlaneDeparture, FaHotel, FaBuilding, FaLifeRing, FaPlane } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { PiLighthouse } from "react-icons/pi";
import Link from "next/link";
import { SiAmericanairlines } from "react-icons/si";
import { usePathname, useRouter } from "next/navigation";
import { decodeToken } from "@/lib/services/common.service";
import { DecodeToken } from "@/types/common/decodeToken";
import { IoFastFood } from "react-icons/io5";
import { MdLuggage } from "react-icons/md";
import Cookies from "js-cookie";
import Button from "@/app/components/ui/Button";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";

const ROUTES = [
  { icon: <FaHome />, textKey: "HOME", url: "/administration" },
  { icon: <FaUser />, textKey: "USERS", url: "/administration/users" },
  { icon: <SiAmericanairlines />, textKey: "AIRLINES", url: "/administration/airlines" },
  { icon: <PiLighthouse />, textKey: "AIRPORTS", url: "/administration/airports" },
  { icon: <FaPlane />, textKey: "AIRPLANES", url: "/administration/airplanes" },
  { icon: <FaPlaneDeparture />, textKey: "FLIGHTS", url: "/administration/flights" },
  { icon: <FaHotel />, textKey: "HOTELS", url: "/administration/hotels" },
  { icon: <FaBuilding />, textKey: "APARTMENTS", url: "/administration/apartments" },
  { icon: <IoFastFood />, textKey: "MEALS", url: "/administration/meals" },
  { icon: <MdLuggage />, textKey: "ADDITIONAL_BAGGAGE", url: "/administration/additional-baggage" },
];

const Sidebar = ({ dict, user }: { dict: any; user: DecodeToken }) => {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const lang = window.location.pathname.includes("/en") ? "en" : "es";

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

const SidebarFooter = ({ collapsed, user }: { collapsed: boolean; user: DecodeToken | null }) => {
  const router = useRouter();
  const { dict } = useDictionary();
  const lang = useLanguage();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push(`login`);
  };

  const [showLogout, setShowLogout] = useState(false);

  const toggleLogout = () => {
    setShowLogout(prev => !prev);
  };

  return (
    <div className={` mt-6 flex ${collapsed ? "justify-center p-0" : "items-center space-x-3 p-4 bg-glacier-900 rounded-xl"}`}>
      <RiAdminFill className="h-10 w-10 rounded-full text-[#FFD580] cursor-pointer" onClick={toggleLogout} />
      {!collapsed && user && !showLogout && (
        <div className="flex flex-col cursor-pointer select-none">
          <p className="text-base font-medium">{user.name}</p>
          <p className="text-sm text-gray-300">{user.role}</p>
        </div>
      )}
      {!collapsed && showLogout && (
        <div className="flex flex-col">
          <Button onClick={handleLogout} text={dict.ADMINISTRATION.SIDEBAR.LOGOUT} color="dark" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
