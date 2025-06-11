import { FaCircleCheck } from "react-icons/fa6";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Notifications } from "@/app/interfaces/Notifications";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";

interface NotificationProps {
  Notifications: Notifications;
  onClose: () => void;
}

export default function NotificacionComponent({ Notifications, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);
  const icon =
    Notifications.tipo === "error" ? (
      <MdOutlineError className="h-6 w-6 text-red-500" />
    ) : Notifications.tipo === "warning" ? (
      <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
    ) : Notifications.tipo === "advise" ? (
      <FaInfoCircle className="h-6 w-6 text-blue-300" />
    ) : (
      <FaCircleCheck className="h-6 w-6 text-green-500" />
    );

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 bg-glacier-50 p-4 rounded-lg shadow-lg flex items-center space-x-4 z-[100]">
      {icon}
      <div className="text-glacier-950">
        <strong>{Notifications.titulo}</strong>
        <span
          className={`text-sm ms-2 ${
            Notifications.tipo === "error" ? "text-red-500" : Notifications.tipo === "warning" ? "text-yellow-500" : Notifications.tipo === "advise" ? "text-blue-300" : "text-green-500"
          }`}>
          {Notifications.code}
        </span>
        <div>{Notifications.mensaje}</div>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        className="flex items-center hover:scale-105 active:scale-95 transition-transform">
        <IoCloseSharp className="h-6 w-6 text-gray-500" />
      </button>
    </motion.div>
  );
}
