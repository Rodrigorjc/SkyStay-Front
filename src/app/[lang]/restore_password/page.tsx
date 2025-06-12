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
  return <input className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`} ref={ref} {...props} />;
});
Input.displayName = "Input";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = "default", className = "", children, ...props }) => {
  const baseStyles = "py-3 rounded-full font-medium transition-all duration-300";
  const variantStyles = {
    default: "bg-(--color-glacier-500) text-white active:scale-98",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    disabled: "bg-gray-400 cursor-not-allowed text-white",
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

  const codeRefs = Array(6)
    .fill(0)
    .map(() => React.createRef<HTMLInputElement>());

  if (!dict || Object.keys(dict).length === 0) {
    return null;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.REQUIRED });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.INVALID });
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post("auth/send-code-password", {
        email: email,
      });
      setNotification({
        titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_SUCCESS.TITLE,
        mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_SUCCESS.MESSAGE,
        code: 200,
        tipo: "success",
      });
      setTimeout(() => {
        setStep("code");
      }, 1000);
    } catch (error) {
      setNotification({
        titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_ERROR.TITLE,
        mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SEND_ERROR.MESSAGE,
        code: 200,
        tipo: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error(dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.VALIDATION_ERROR.MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      await axiosClient.post("auth/verify-code", {
        code: parseInt(code.join("")),
        email: email,
      });
      setNotification({
        titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.TITLE,
        mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.MESSAGE,
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
        titulo: errorData?.title || dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.TITLE,
        mensaje: errorData?.message || dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.MESSAGE,
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
      newErrors.password = dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.REQUIRED;
    } else if (!validatePassword(password)) {
      newErrors.password = dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.INVALID;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.MISMATCH;
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
        titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED.TITLE,
        mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED.MESSAGE,
        code: 200,
        tipo: "success",
      });
      router.push(`/${lang}/login`);
    } catch (error) {
      setNotification({
        titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED_ERROR.TITLE,
        mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.PASSWORD_CHANGED_ERROR.MESSAGE,
        code: 200,
        tipo: "success",
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

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Mover al input anterior al presionar backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs[index - 1].current?.focus();
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la llamada a la API para reenviar el código
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular llamada API
      toast.success(dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_SUCCESS.MESSAGE);
    } catch (error) {
      toast.error(dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.MESSAGE);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex flex-col text-black">
      <Navbar />
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-(--color-glacier-50) rounded-2xl shadow-md">
          {step === "email" && (
            <>
              <h2 className="text-2xl text-(--color-glacier-600) font-bold mb-4">Recuperar contraseña</h2>
              <p className="text-gray-600 mb-6">Introduce tu correo electrónico para recibir un código de verificación</p>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4 w-full">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email:
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={errors.email ? "border-red-500" : "w-full text-black"}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={`w-full py-3 rounded-full font-medium text-white
                            transition-all duration-300 ${
                              isLoading || !email.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-(--color-glacier-500) hover:bg-(--color-glacier-600) hover:scale-105 active:scale-98"
                            }`}>
                  {isLoading ? dict.CLIENT.CODE_VALIDATION.BUTTONS.LOADING : dict.CLIENT.CODE_VALIDATION.BUTTONS.VERIFY}
                </Button>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <h2 className="text-2xl font-bold text-(--color-glacier-600) mb-4">{dict.CLIENT.CODE_VALIDATION.TITLE}</h2>
              <p className="text-center text-gray-600 mb-6">
                {dict.CLIENT.CODE_VALIDATION.SUBTITLE}
                {email && <span className="font-bold block mt-1">{email}</span>}
              </p>
              <form onSubmit={handleCodeSubmit}>
                <div className="flex justify-center space-x-2 mb-8">
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div key={index} className="w-12 h-16 relative">
                        <input
                          ref={el => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          maxLength={1}
                          className={`w-full h-full text-center text-2xl font-bold rounded-lg border-2
                                    focus:outline-none focus:ring-2 transition-all ${
                                      code[index] ? "border-(--color-glacier-500) bg-(--color-glacier-100) text-(--color-glacier-800)" : "border-gray-300 bg-white text-gray-700"
                                    } focus:ring-(--color-glacier-400) focus:border-(--color-glacier-500)`}
                          value={code[index]}
                          onChange={e => handleCodeChange(index, e.target.value)}
                          onKeyDown={e => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                </div>
                <button
                  disabled={isLoading || code.join("").length !== 6}
                  className={`w-full py-3 rounded-full font-medium text-white
                            transition-all duration-300 ${
                              isLoading || code.join("").length !== 6 ? "bg-gray-400 cursor-not-allowed" : "bg-(--color-glacier-500) hover:bg-(--color-glacier-600) hover:scale-105 active:scale-98"
                            }`}>
                  {isLoading ? dict.CLIENT.CODE_VALIDATION.BUTTONS.LOADING : dict.CLIENT.CODE_VALIDATION.BUTTONS.VERIFY}
                </button>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <h2 className="text-2xl text-(--color-glacier-600) font-bold mb-4">Establecer nueva contraseña</h2>
              <p className="text-gray-600 mb-6">{dict.CLIENT.LOGIN.PASSWORD.MESSAGE}</p>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4 w-full">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    {dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.LABEL}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={errors.password ? "border-red-500 w-full pr-10" : "w-full pr-10"}
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <MdVisibilityOff></MdVisibilityOff> : <MdVisibility></MdVisibility>}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 w-full">{errors.password}</p>}
                </div>
                <div className="mb-6 w-full">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    {dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.LABEL}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? "border-red-500 w-full pr-10" : "w-full pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <MdVisibilityOff></MdVisibilityOff> : <MdVisibility></MdVisibility>}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-full font-medium text-white
    transition-all duration-300 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-(--color-glacier-500) hover:bg-(--color-glacier-600) hover:scale-105 active:scale-98"}`}>
                  {isLoading ? dict.CLIENT.CODE_VALIDATION.BUTTONS.LOADING : "Actualizar contraseña"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
      {notification && <NotificationComponent Notifications={notification} onClose={() => setNotification(undefined)} />}
    </div>
  );
}
