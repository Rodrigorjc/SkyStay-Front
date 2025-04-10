import { useState } from "react";
import { FaHome, FaPlane, FaHotel, FaBuilding, FaPlaneDeparture, FaSuitcase, FaBook, FaCreditCard, FaChartPie, FaLifeRing, FaBars, FaChevronLeft, FaUser } from "react-icons/fa";
import { JSX } from "react";

const Sidebar = ({ dict }: { dict: any }) => {
  const [collapsed, setCollapsed] = useState(true);

  const pathname = window.location.pathname;
  const toggleSidebar = () => setCollapsed(prev => !prev);
  const lang = window.location.pathname.includes("/en") ? "en" : "es";

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
          <SidebarItem icon={<FaHome />} text={dict.ADMINISTRATION.SIDEBAR.HOME} url={`/${lang}/administration`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaUser />} text={dict.ADMINISTRATION.SIDEBAR.USERS} url={`/${lang}/administration/users`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaPlane />} text={dict.ADMINISTRATION.SIDEBAR.FLIGHTS} url={`/${lang}/administration/flights`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaHotel />} text={dict.ADMINISTRATION.SIDEBAR.HOTELS} url={`/${lang}/administration/hotels`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaBuilding />} text={dict.ADMINISTRATION.SIDEBAR.APARTMENTS} url={`/${lang}/administration/apartments`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaPlaneDeparture />} text={dict.ADMINISTRATION.SIDEBAR.AIRPORTS} url={`/${lang}/administration/airports`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaPlane />} text={dict.ADMINISTRATION.SIDEBAR.PLANES} url={`/${lang}/administration/planes`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaSuitcase />} text={dict.ADMINISTRATION.SIDEBAR.BASIC_LUGGAGE} url={`/${lang}/administration/basic-luggage`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaBook />} text={dict.ADMINISTRATION.SIDEBAR.BOOKINGS} url={`/${lang}/administration/bookings`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaCreditCard />} text={dict.ADMINISTRATION.SIDEBAR.PAYMENTS_BILLING} url={`/${lang}/administration/payments-billing`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaChartPie />} text={dict.ADMINISTRATION.SIDEBAR.REPORTS_STATISTICS} url={`/${lang}/administration/reports-statistics`} collapsed={collapsed} currentPath={pathname} />
          <SidebarItem icon={<FaLifeRing />} text={dict.ADMINISTRATION.SIDEBAR.SUPPORT} url={`/${lang}/administration/support`} collapsed={collapsed} currentPath={pathname} />
        </ul>
      </nav>

      {/* User info */}
      <div className={`mt-6 flex ${collapsed ? "justify-center" : "items-center space-x-3"}`}>
        <FaUser className="h-10 w-10 rounded-full" />
        {!collapsed && <span className="text-base font-medium">Tom Cook</span>}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, url, badge, collapsed, currentPath }: { icon?: JSX.Element; text: string; url?: string; badge?: string; collapsed?: boolean; currentPath: string }) => {
  const isActive = url === currentPath;

  return (
    <a
      href={url || "#"}
      className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 
      ${collapsed ? "flex justify-center" : "flex items-center justify-between"} 
      ${isActive ? "bg-glacier-700 hover:bg-glacier-800" : "hover:bg-gray-800"}`}>
      <li>
        <p className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}>
          {icon && <span className="text-lg">{icon}</span>}
          {!collapsed && <span>{text}</span>}
        </p>
        {!collapsed && badge && <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">{badge}</span>}
      </li>
    </a>
  );
};

export default Sidebar;
