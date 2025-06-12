"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@components/Navbar";
import axiosClient from "@/lib/axiosClient";
import { useDictionary } from "@context";
import NotificacionComponent from "@components/Notification";

const ValidationPage = () => {
  const { dict } = useDictionary();
  const [code, setCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [notification, setNotification] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  const router = useRouter();

  if (!dict || Object.keys(dict).length === 0) {
    return <div>Cargando...</div>;
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("El email es requerido");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de email inválido");
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post("/auth/send-activation-code", {
        email,
      });

      setNotification({
        titulo: "Código enviado",
        mensaje: "Se ha enviado un código de activación a su correo electrónico",
        code: 200,
        tipo: "success",
      });

      setCodeSent(true);
    } catch (error: any) {
      setNotification({
        titulo: "Error",
        mensaje: error.response?.data?.message || "Error al enviar el código de activación",
        code: error.response?.status || 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("El código es requerido");
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post("/auth/validate", {
        email,
        activationCode: code,
      });

      setNotification({
        titulo: "Éxito",
        mensaje: "Su cuenta ha sido activada correctamente",
        code: 200,
        tipo: "success",
      });

      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 2000);
    } catch (error: any) {
      setNotification({
        titulo: "Error",
        mensaje: error.response?.data?.message || "Error al validar el código",
        code: error.response?.status || 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Validación de cuenta</h2>

          {!codeSent ? (
            <>
              <p className="text-gray-600 text-center mb-4">Ingrese su correo electrónico para recibir un código de activación</p>
              <form onSubmit={handleSendCode}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Correo electrónico" />
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                  {isLoading ? "Enviando..." : "Enviar código"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-4">Ingrese el código de activación recibido en su correo</p>
              <form onSubmit={handleValidateCode}>
                <div className="mb-3">
                  <label htmlFor="emailDisplay" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input id="emailDisplay" type="email" value={email} disabled className="w-full px-3 py-2 border rounded-md bg-gray-100" />
                </div>

                <div className="mb-4">
                  <label htmlFor="code" className="block text-sm font-medium mb-1">
                    Código
                  </label>
                  <input id="code" type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Código de activación" />
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                  {isLoading ? "Procesando..." : "Validar cuenta"}
                </button>

                <div className="mt-2">
                  <button type="button" onClick={handleSendCode} className="text-sm text-blue-500 hover:underline w-full text-center">
                    Reenviar código
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-3 text-center">
            <button onClick={() => router.push(`/${lang}/login`)} className="text-sm text-blue-500 hover:underline">
              Volver a iniciar sesión
            </button>
          </div>
        </div>
      </div>

      {notification && <NotificacionComponent Notifications={notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default ValidationPage;
