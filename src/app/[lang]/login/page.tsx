'use client';

import { useState } from "react";
import Cookies from "js-cookie";
import Navbar from "@components/Navbar";
import { useDictionary } from "@context";
import { MdOutlineEmail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md";
import {Notifications} from "@/app/interfaces/Notifications";
import NotificationComponent from "@components/Notification";
import {usePathname, useRouter} from "next/navigation";
import axiosClient from "@/lib/axiosClient";

const LoginPage = () => {
    const { dict } = useDictionary();
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<Notifications>();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en";

    if (!dict || Object.keys(dict).length === 0) {
        return;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail() || !validatePassword()) {
            return;
        }

        try {
            const response = await axiosClient.post("auth/login", {
                email,
                password,
            });

            const token = response.data.response.objects.token;
            Cookies.set("token", token, { expires: 1 });
            setNotification({
                titulo: dict.CLIENT.LOGIN.NOTIFICATION.SUCCESS.TITLE,
                mensaje: dict.CLIENT.LOGIN.NOTIFICATION.SUCCESS.MESSAGE,
                code: 200,
                tipo: "success",
            });
            setTimeout(() => {
                router.push(`/${lang}`);
            }, 1000);
        } catch (err: any) {
            console.error("Error de login:", err);

            // Intenta obtener el mensaje de error del backend si está disponible
            const errorMessage = err.response?.data?.messages?.message ||
                "Error al iniciar sesión. Verifica tus credenciales.";
            const errorCode = err.response?.data?.messages?.code || 401;

            setNotification({
                titulo: "Error de inicio de sesión",  // Valor fijo para evitar problemas con dict
                mensaje: errorMessage,
                code: errorCode,
                tipo: "error",
            });
        }
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setNotification({
                titulo: dict.CLIENT.LOGIN.NOTIFICATION.EMAIL.TITLE,
                mensaje: dict.CLIENT.LOGIN.NOTIFICATION.EMAIL.MESSAGE,
                code: 400,
                tipo: "warning",
            });
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
        if (!passwordRegex.test(password)) {
            setNotification({
                titulo: dict.CLIENT.LOGIN.NOTIFICATION.PASSWORD.TITLE,
                mensaje: dict.CLIENT.LOGIN.NOTIFICATION.PASSWORD.MESSAGE,
                code: 400,
                tipo: "warning",
            });
            return false;
        }
        return true;
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar dict={dict}></Navbar>
            <div className="flex flex-grow items-center justify-center w-full px-4">
                <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl flex justify-center mb-5 pb-10 text-center">
                        <p>{dict.CLIENT.LOGIN.START_TEXT}</p>
                    </div>
                    <div className="flex flex-col space-y-4 justify-center w-full">
                        <div className="relative">
                    <span className="absolute text-xl sm:text-2xl left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <MdOutlineEmail />
                    </span>
                            <input
                                type="text"
                                id="email"
                                placeholder={dict.CLIENT.LOGIN.EMAIL}
                                value={email}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={validateEmail}
                                required
                                className="w-full text-sm sm:text-lg pl-12 pr-4 py-2.5 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />
                        </div>
                        <div className="relative text-sm sm:text-lg">
                    <span className="absolute text-xl sm:text-2xl left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <MdPassword />
                    </span>
                            <span
                                className="absolute text-xl sm:text-2xl right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder={dict.CLIENT.LOGIN.PASSWORD}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                                required
                                className="w-full pl-12 pr-10 py-2.5 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        <div className="text-right text-xs sm:text-sm text-gray-400 pe-3">
                            {dict.CLIENT.LOGIN.FORGOT_PASSWORD} <span className="underline cursor-pointer">{dict.CLIENT.LOGIN.CLICK_HERE}</span>
                        </div>

                        <button
                            type="submit"
                            className="py-2 px-4 rounded-full text-black bg-(--color-glacier-400) hover:bg-(--color-glacier-500) text-sm sm:text-lg font-medium active:bg-(--color-glacier-600) active:text-white transition active:scale-95 hover:scale-105"
                        >
                            {dict.CLIENT.LOGIN.LOGIN}
                        </button>

                        <div className="text-center text-xs sm:text-sm text-gray-400">
                            {dict.CLIENT.LOGIN.HAVE_ACCOUNT} <span className="underline cursor-pointer">{dict.CLIENT.LOGIN.CLICK_HERE}</span>
                        </div>
                    </div>
                </form>
            </div>
            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
        </div>
    );
};

export default LoginPage;