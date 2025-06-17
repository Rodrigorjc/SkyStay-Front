"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@components/Navbar";
import axiosClient from "@/lib/axiosClient";
import NotificationComponent from "@components/Notification";
import { useDictionary } from "@context";
import { Notifications } from "@/app/interfaces/Notifications";
import Cookies from "js-cookie";

const CodeValidation: React.FC = () => {
  const { dict } = useDictionary();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [notification, setNotification] = useState<Notifications>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // Función helper para obtener textos con fallback
  const getText = (path: string, fallback: string) => {
    try {
      const keys = path.split(".");
      let value = dict;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const savedEmail = Cookies.get("registrationEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
      setEmailInput(savedEmail);
    }
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const validateCode = async () => {
    if (code.join("").length !== 6) {
      setNotification({
        titulo: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.VALIDATION_ERROR.TITLE", "Error de validación"),
        mensaje: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.VALIDATION_ERROR.MESSAGE", "Por favor ingresa un código de 6 dígitos"),
        code: 400,
        tipo: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post("auth/verify-code", {
        code: parseInt(code.join("")),
        email: userEmail || emailInput,
      });

      Cookies.remove("registrationEmail");

      setNotification({
        titulo: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.TITLE", "Código verificado"),
        mensaje: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.MESSAGE", "Tu cuenta ha sido verificada correctamente"),
        code: 200,
        tipo: "success",
      });

      setTimeout(() => {
        window.location.href = `/${lang}/login`;
      }, 2000);
    } catch (error: any) {
      const errorData = error.response?.data;

      setNotification({
        titulo: errorData?.title || getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.TITLE", "Error"),
        mensaje: errorData?.message || getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.MESSAGE", "Código incorrecto o expirado"),
        code: error.response?.status || 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!emailInput) {
      setNotification({
        titulo: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.TITLE", "Error"),
        mensaje: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.MESSAGE", "Por favor ingresa un email válido"),
        code: 400,
        tipo: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post("auth/resend-code", {
        email: emailInput,
      });

      setNotification({
        titulo: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_SUCCESS.TITLE", "Código reenviado"),
        mensaje: getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_SUCCESS.MESSAGE", "Se ha enviado un nuevo código a tu email"),
        code: 200,
        tipo: "success",
      });

      Cookies.set("registrationEmail", emailInput, {
        expires: 1 / 24, // 1 hora en días
        secure: true, // Solo HTTPS
        sameSite: "strict", // Protección contra CSRF
      });

      setIsModalOpen(false);
    } catch (error: any) {
      const errorData = error.response?.data;

      setNotification({
        titulo: errorData?.title || getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.TITLE", "Error"),
        mensaje: errorData?.message || getText("CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.MESSAGE", "Error al reenviar el código"),
        code: error.response?.status || 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!dict || Object.keys(dict).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-glacier-200 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="flex flex-grow justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-zinc-800 rounded-xl shadow-2xl border border-glacier-700 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-glacier-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h2 className="text-2xl font-semibold text-glacier-200 uppercase mb-4">
              {getText("CLIENT.CODE_VALIDATION.TITLE", "Verificar Código")}
            </h2>
            <p className="text-glacier-400 text-sm mb-2">
              {getText("CLIENT.CODE_VALIDATION.SUBTITLE", "Ingresa el código de 6 dígitos enviado a tu email")}
            </p>
            {emailInput && (
              <span className="text-glacier-300 font-medium text-sm bg-zinc-700 px-3 py-1 rounded-full">
                {emailInput}
              </span>
            )}
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="w-12 h-14">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    className={`w-full h-full text-center text-xl font-bold rounded-lg border-2
                                    focus:outline-none focus:ring-2 transition-all bg-zinc-700 text-glacier-100 ${
                                      code[index]
                                        ? "border-glacier-500 bg-zinc-600 text-glacier-100"
                                        : "border-zinc-600"
                                    } focus:ring-glacier-400 focus:border-glacier-500`}
                    value={code[index]}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isLoading}
                  />
                </div>
              ))}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={validateCode}
              disabled={isLoading || code.join("").length !== 6}
              className={`w-full py-3 rounded-lg font-medium text-white
                            transition-all duration-300 hover:scale-105 active:scale-95 ${
                              isLoading || code.join("").length !== 6
                                ? "bg-zinc-600 cursor-not-allowed text-glacier-400"
                                : "bg-glacier-600 hover:bg-glacier-700"
                            }`}
            >
              {isLoading
                ? getText("CLIENT.CODE_VALIDATION.BUTTONS.LOADING", "Verificando...")
                : getText("CLIENT.CODE_VALIDATION.BUTTONS.VERIFY", "Verificar Código")}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="text-glacier-400 hover:text-glacier-200 text-sm font-medium transition-colors py-2"
            >
              {getText("CLIENT.CODE_VALIDATION.BUTTONS.RESEND", "¿No recibiste el código? Reenviar")}
            </button>
          </div>
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800 rounded-xl p-6 w-full max-w-md border border-glacier-700 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-glacier-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📨</span>
              </div>
              <h3 className="text-glacier-200 text-xl font-semibold mb-2">
                {getText("CLIENT.CODE_VALIDATION.RESEND_MODAL.TITLE", "Reenviar Código")}
              </h3>
              <p className="text-glacier-400 text-sm">
                {getText("CLIENT.CODE_VALIDATION.RESEND_MODAL.SUBTITLE", "Ingresa tu email para recibir un nuevo código de verificación")}
              </p>
            </div>

            <div className="mb-6">
              <input
                type="email"
                className="w-full bg-zinc-700 text-glacier-100 placeholder-glacier-400 px-4 py-3 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all"
                placeholder={getText("CLIENT.CODE_VALIDATION.RESEND_MODAL.EMAIL_PLACEHOLDER", "correo@ejemplo.com")}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-glacier-400 hover:text-glacier-200 transition-colors"
                disabled={isLoading}
              >
                {getText("CLIENT.CODE_VALIDATION.RESEND_MODAL.CANCEL", "Cancelar")}
              </button>
              <button
                onClick={resendCode}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isLoading
                    ? "bg-zinc-600 text-glacier-400 cursor-not-allowed"
                    : "bg-glacier-600 hover:bg-glacier-700 text-white hover:scale-105 active:scale-95"
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? getText("CLIENT.CODE_VALIDATION.BUTTONS.LOADING", "Enviando...")
                  : getText("CLIENT.CODE_VALIDATION.RESEND_MODAL.SEND", "Enviar Código")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {notification && <NotificationComponent Notifications={notification} onClose={() => setNotification(undefined)} />}
    </div>
  );
};

export default CodeValidation;
