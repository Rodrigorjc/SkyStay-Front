"use client";

import { useDictionary } from "@context";
import Navbar from "../components/ui/Navbar";
import CloudinaryUpload from "../components/upload/UploadImage";
import { useState } from "react";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@components/Notification";

export default function Home({}: { params: { lang: string } }) {
  const { dict } = useDictionary();
  const [notification, setNotification] = useState<Notifications>();

  if (!dict) return null;

  const triggerNotification = (tipo: string) => {
    setNotification({
      titulo: `Notificación de tipo ${tipo}`,
      mensaje: `Este es un mensaje de prueba para el tipo ${tipo}.`,
      code: 200,
      tipo: tipo,
    });
  };

  return (
    <div>
      <Navbar dict={dict}></Navbar>
      <div className="flex flex-col items-center justify-center w-full mt-10">
        <h1 className="text-3xl my-4">{dict.HOME.WELCOME}</h1>

        <div className="space-x-4 mt-4">
          <button onClick={() => triggerNotification("error")} className="bg-red-500 text-white px-4 py-2 rounded">
            Error
          </button>
          <button onClick={() => triggerNotification("warning")} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Warning
          </button>
          <button onClick={() => triggerNotification("advise")} className="bg-blue-300 text-white px-4 py-2 rounded">
            Aviso
          </button>
          <button onClick={() => triggerNotification("success")} className="bg-green-500 text-white px-4 py-2 rounded">
            Success
          </button>
        </div>
        {notification && <NotificationComponent Notifications={notification} onClose={() => setNotification(undefined)} />}
      </div>
    </div>
  );
}
