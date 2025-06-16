"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDictionary } from "@context";
import Navbar from "@components/Navbar";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@components/Notification";
import axiosClient from "@/lib/axiosClient";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { className?: string }>(({ className, ...props }, ref) => {
  return <input className={`px-4 py-3 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 bg-zinc-700 text-glacier-100 placeholder-glacier-400 ${className}`} ref={ref} {...props} />;
});
Input.displayName = "Input";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = "default", className = "", children, ...props }) => {
  const baseStyles = "py-3 rounded-lg font-medium transition-all duration-300";
  const variantStyles = {
    default: "bg-glacier-600 hover:bg-glacier-700 text-white active:scale-98",
    outline: "border border-zinc-600 bg-zinc-700 text-glacier-200 hover:bg-zinc-600",
    disabled: "bg-zinc-600 cursor-not-allowed text-glacier-400",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const validatePassword = (password: string): boolean => {
  // Al menos 6 caracteres, un número y un carácter especial
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
  return regex.test(password);
};

type Step = "email" | "code" | "password";

export default function RestorePassword() {
  const { lang } = useParams();
  const router = useRouter();
  const { dict } = useDictionary();
  const [notification, setNotification] = useState<Notifications>();
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!dict || Object.keys(dict).length === 0) {
    return null;
  }

  // Función helper para obtener textos con fallback
  const getText = (path: string, fallback: string) => {
    try {
      const keys = path.split('.');
      let value = dict;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || fallback;
    } catch {
      return fallback;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ 
        email: getText('CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.REQUIRED', 'El email es requerido')
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ 
        email: getText('CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.INVALID', 'Email inválido')
      });
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post("auth/send-code-password", {
        email: email,
      });
      setNotification({
        titulo: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_SUCCESS.TITLE', 'Código enviado'),
        mensaje: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_SUCCESS.MESSAGE', 'Se ha enviado un código a tu email'),
        code: 200,
        tipo: "success",
      });
      setTimeout(() => {
        setStep("code");
      }, 1000);
    } catch (error) {
      setNotification({
        titulo: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_ERROR.TITLE', 'Error'),
        mensaje: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_ERROR.MESSAGE', 'Error al enviar el código'),
        code: 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error(getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.VALIDATION_ERROR.MESSAGE', 'Código inválido'));
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post("auth/verify-code", {
        code: parseInt(code.join("")),
        email: email,
      });
      setNotification({
        titulo: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.TITLE', 'Código verificado'),
        mensaje: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.MESSAGE', 'El código ha sido verificado correctamente'),
        code: 200,
        tipo: "success",
      });
      setTimeout(() => {
        setStep("password");
      }, 1000);
    } catch (error) {
      let errorData;
      let errorStatus;
      if (typeof error === "object" && error !== null && "response" in error && typeof (error as any).response === "object") {
        errorData = (error as any).response?.data;
        errorStatus = (error as any).response?.status;
      }

      setNotification({
        titulo: errorData?.title || getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.TITLE', 'Error'),
        mensaje: errorData?.message || getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.MESSAGE', 'Código incorrecto'),
        code: errorStatus || 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = getText('CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.REQUIRED', 'La contraseña es requerida');
    } else if (!validatePassword(password)) {
      newErrors.password = getText('CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.INVALID', 'Contraseña inválida');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = getText('CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.MISMATCH', 'Las contraseñas no coinciden');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post("auth/change-password", {
        password: password,
        email: email,
      });
      setNotification({
        titulo: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED.TITLE', 'Contraseña actualizada'),
        mensaje: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED.MESSAGE', 'Tu contraseña ha sido actualizada correctamente'),
        code: 200,
        tipo: "success",
      });
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 2000);
    } catch (error) {
      setNotification({
        titulo: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED_ERROR.TITLE', 'Error'),
        mensaje: getText('CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED_ERROR.MESSAGE', 'Error al cambiar la contraseña'),
        code: 500,
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navbar />
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-zinc-800 rounded-xl shadow-2xl border border-glacier-700">
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-glacier-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h2 className="text-2xl text-glacier-200 font-bold mb-2">
                  {getText('CLIENT.RESTORE_PASSWORD.RECOVER_PASSWORD', 'Recuperar contraseña')}
                </h2>
                <p className="text-glacier-400 text-sm">
                  {getText('CLIENT.RESTORE_PASSWORD.ADD_EMAIL', 'Ingresa tu email para recuperar tu contraseña')}
                </p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-glacier-300">
                    {getText('CLIENT.RESTORE_PASSWORD.EMAIL', 'Email')}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={errors.email ? "border-red-500" : "w-full"}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={`w-full ${
                    isLoading || !email.trim() 
                      ? "bg-zinc-600 cursor-not-allowed text-glacier-400" 
                      : "bg-glacier-600 hover:bg-glacier-700 hover:scale-105 active:scale-98"
                  }`}>
                  {isLoading ? 'Enviando...' : 'Enviar código'}
                </Button>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-glacier-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h2 className="text-2xl font-bold text-glacier-200 mb-2">
                  {getText('CLIENT.CODE_VALIDATION.TITLE', 'Verificar código')}
                </h2>
                <p className="text-glacier-400 text-sm mb-2">
                  {getText('CLIENT.CODE_VALIDATION.SUBTITLE', 'Ingresa el código enviado a tu email')}
                </p>
                {email && <span className="text-glacier-300 font-medium text-sm bg-zinc-700 px-3 py-1 rounded-full">{email}</span>}
              </div>
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div key={index} className="w-12 h-14">
                        <input
                          ref={el => {
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
                          onChange={e => handleCodeChange(index, e.target.value)}
                          onKeyDown={e => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || code.join("").length !== 6}
                  className={`w-full ${
                    isLoading || code.join("").length !== 6 
                      ? "bg-zinc-600 cursor-not-allowed text-glacier-400" 
                      : "bg-glacier-600 hover:bg-glacier-700 hover:scale-105 active:scale-98"
                  }`}>
                  {isLoading ? 'Verificando...' : 'Verificar código'}
                </Button>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-glacier-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔑</span>
                </div>
                <h2 className="text-2xl text-glacier-200 font-bold mb-2">
                  {getText('CLIENT.RESTORE_PASSWORD.NEW_PASSWORD', 'Nueva contraseña')}
                </h2>
                <p className="text-glacier-400 text-sm">
                  {getText('CLIENT.LOGIN.PASSWORD.MESSAGE', 'Mínimo 6 caracteres, incluyendo números y símbolos')}
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-glacier-300">
                    {getText('CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.LABEL', 'Contraseña')}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={errors.password ? "border-red-500 pr-12" : "pr-12 w-full"}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glacier-400 hover:text-glacier-200 transition-colors" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-glacier-300">
                    {getText('CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.LABEL', 'Confirmar contraseña')}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? "border-red-500 pr-12" : "pr-12 w-full"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-glacier-400 hover:text-glacier-200 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading 
                      ? "bg-zinc-600 cursor-not-allowed text-glacier-400" 
                      : "bg-glacier-600 hover:bg-glacier-700 hover:scale-105 active:scale-98"
                  }`}>
                  {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                </Button>
              </form>
            </>
          )}

          {/* Indicador de pasos */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all ${step === "email" ? "bg-glacier-500" : "bg-zinc-600"}`}></div>
            <div className={`w-2 h-2 rounded-full transition-all ${step === "code" ? "bg-glacier-500" : "bg-zinc-600"}`}></div>
            <div className={`w-2 h-2 rounded-full transition-all ${step === "password" ? "bg-glacier-500" : "bg-zinc-600"}`}></div>
          </div>
        </div>
      </div>
      {notification && <NotificationComponent Notifications={notification} onClose={() => setNotification(undefined)} />}
    </div>
  );
}
