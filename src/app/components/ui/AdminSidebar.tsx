import { useState, useEffect } from "react";
import { FaHome, FaPlane, FaHotel, FaBuilding, FaPlaneDeparture, FaSuitcase, FaBook, FaCreditCard, FaChartPie, FaLifeRing, FaBars, FaChevronLeft } from "react-icons/fa";
import { JSX } from "react";

const Sidebar = ({ dict }: { dict: any }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <div className={`h-screen bg-glacier-500 text-white flex flex-col p-4 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      <div className={`mb-6 gap-4 ${collapsed ? "flex justify-center" : "flex items-center justify-between"}`}>
        {!collapsed && <h1 className="flex items-center text-2xl font-bold">SkyStay</h1>}
        <button onClick={toggleSidebar} className="text-white text-xl">
          {collapsed ? <FaBars /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          <SidebarItem icon={<FaHome />} text={dict.ADMINISTRATION.SIDEBAR.HOME} url="lang/administration" collapsed={collapsed} />
          <SidebarItem icon={<FaPlane />} text={dict.ADMINISTRATION.SIDEBAR.FLIGHTS} url="/administration/flights" collapsed={collapsed} />
          <SidebarItem icon={<FaHotel />} text={dict.ADMINISTRATION.SIDEBAR.HOTELS} url="/administration/hotels" collapsed={collapsed} />
          <SidebarItem icon={<FaBuilding />} text={dict.ADMINISTRATION.SIDEBAR.APARTMENTS} url="/administration/apartments" collapsed={collapsed} />
          <SidebarItem icon={<FaPlaneDeparture />} text={dict.ADMINISTRATION.SIDEBAR.AIRPORTS} url="/administration/airports" collapsed={collapsed} />
          <SidebarItem icon={<FaPlane />} text={dict.ADMINISTRATION.SIDEBAR.PLANES} url="/administration/planes" collapsed={collapsed} />
          <SidebarItem icon={<FaSuitcase />} text={dict.ADMINISTRATION.SIDEBAR.BASIC_LUGGAGE} url="/administration/basic-luggage" collapsed={collapsed} />
          <SidebarItem icon={<FaBook />} text={dict.ADMINISTRATION.SIDEBAR.BOOKINGS} url="/administration/bookings" collapsed={collapsed} />
          <SidebarItem icon={<FaCreditCard />} text={dict.ADMINISTRATION.SIDEBAR.PAYMENTS_BILLING} url="/administration/payments-billing" collapsed={collapsed} />
          <SidebarItem icon={<FaChartPie />} text={dict.ADMINISTRATION.SIDEBAR.REPORTS_STATISTICS} url="/administration/reports-statistics" collapsed={collapsed} />
          <SidebarItem icon={<FaLifeRing />} text={dict.ADMINISTRATION.SIDEBAR.SUPPORT} url="/administration/support" collapsed={collapsed} />
        </ul>
      </nav>

      {/* User info */}
      <div className={`mt-6 flex ${collapsed ? "justify-center" : "items-center space-x-3"}`}>
        <img src="https://t3.ftcdn.net/jpg/05/17/79/88/360_F_517798849_WuXhHTpg2djTbfNf0FQAjzFEoluHpnct.jpg" alt="User" className="h-10 w-10 rounded-full" />
        {!collapsed && <span className="text-base font-medium">Tom Cook</span>}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, url, badge, collapsed }: { icon?: JSX.Element; text: string; url?: string; badge?: string; collapsed?: boolean }) => {
  return (
    <li className={`px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 ${collapsed ? "flex justify-center" : "flex items-center justify-between"}`}>
      <a href={url || "#"} className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}>
        {icon && <span className="text-lg">{icon}</span>}
        {!collapsed && <span>{text}</span>}
      </a>
      {!collapsed && badge && <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">{badge}</span>}
    </li>
  );
};

export default Sidebar;
