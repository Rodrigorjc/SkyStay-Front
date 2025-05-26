import { FaCircleCheck } from "react-icons/fa6";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";
import { motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import { Notifications } from "@/app/interfaces/Notifications";

interface NotificationProps {
  Notifications: Notifications;
  onClose: () => void;
}

type NotificationType = "error" | "warning" | "advise" | "success";

const iconMap: Record<NotificationType, JSX.Element> = {
  error: <MdOutlineError className="h-6 w-6 text-red-500" />,
  warning: <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />,
  advise: <FaInfoCircle className="h-6 w-6 text-blue-400" />,
  success: <FaCircleCheck className="h-6 w-6 text-green-500" />,
};

const textColorMap: Record<NotificationType, string> = {
  error: "text-red-500",
  warning: "text-yellow-500",
  advise: "text-blue-400",
  success: "text-green-500",
};

export default function NotificationComponent({ Notifications, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  const tipo = (Notifications.tipo || "success") as NotificationType;
  const icon = iconMap[tipo];
  const codeColor = textColorMap[tipo];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 right-6 w-[360px] max-w-[90%] z-50 bg-zinc-900 border-l-4 border-glacier-500 rounded-xl shadow-md p-5 flex gap-4">
      <div className="text-glacier-400 text-xl mt-1">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="text-base font-semibold text-glacier-400">{Notifications.titulo}</h2>
          <button onClick={handleClose} aria-label="Cerrar notificación" className="text-zinc-500 hover:text-glacier-300 transition">
            <IoCloseSharp className="h-5 w-5" />
          </button>
        </div>

        {Notifications.code && <div className="inline-block mt-1 mb-2 px-2 py-0.5 text-xs font-mono bg-zinc-800 text-zinc-300 rounded">{Notifications.code}</div>}
        <p className="text-sm text-zinc-200 leading-snug">{Notifications.mensaje}</p>
      </div>
    </motion.div>
  );
}
