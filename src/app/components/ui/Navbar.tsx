"use client";
import {usePathname, useRouter} from "next/navigation";
import {motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import {FaBars, FaTimes} from "react-icons/fa";


interface NavbarProps {
    dict?: any
}
const getNavigation = (dict: any) => [
    {name: dict.CLIENT.SIDEBAR.FLIGHTS, href: "/flights", current: false},
    {name:  dict.CLIENT.SIDEBAR.ACCOMMODATIONS, href: "/accomodations", current: false},
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar({dict}: NavbarProps) {
    const [usuario, setUser] = useState<{ username: string, roles: string[] } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigation = getNavigation(dict);
    const router = useRouter();

    function cerrarSesion() {
        Cookies.remove("token");
        setToken(null);
        router.push(`/${lang}`);
    }

    useEffect(() => {
        const tokenFromCookies = Cookies.get('token');
        setToken(tokenFromCookies || null);

        if (tokenFromCookies) {
            try {
                const tokenDescodificado = jwtDecode<{ username: string, roles: string[] }>(tokenFromCookies);
                setUser(tokenDescodificado);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en"; // Idioma por defecto: "en"


    return (
        <nav className="pt-3 sticky top-0 z-50">
            <motion.div
                className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-3/4 bg-(--color-glacier-50) rounded-4xl drop-shadow-lg"
                initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.4}}>
                <div className="relative flex h-16 items-center ">
                    <div className="max-sm:pl-3 pr-3">
                        <span className="text-4xl text-(--color-glacier-500) cursor-pointer logo"
                              onClick={() => router.push(`/${lang}`)}>
                            SkyStay
                        </span>
                    </div>
                    <div className="absolute inset-y-0 right-2 flex items-center lg:hidden ">
                        {/* Mobile menu button */}
                        <button onClick={() => setMenuOpen(!menuOpen)}
                                className="group relative inline-flex items-center justify-center rounded-md p-2 border border-gray-300 active:border-(--color-glacier-500)">
                            <span className="sr-only">Abrir menu</span>
                            {menuOpen ? <FaTimes className="block size-6 text-(--color-glacier-300)" aria-hidden="true"/> :
                                <FaBars className="block size-6 text-(--color-glacier-300)" aria-hidden="true"/>}
                        </button>
                    </div>
                    <div className="hidden lg:flex md:space-x-2 space-x-5 ml-2">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={`${lang}/${item.href}`}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={classNames(
                                    pathname === item.href
                                        ? "underline text-(--color-glacier-700)"
                                        : "text-(--color-glacier-500) hover:bg-(--color-glacier-400) active:bg-(--color-glacier-500) hover:text-white transition transform active:scale-95 hover:scale-105",
                                    "py-2 px-4 rounded-full text-xl font-medium "
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="flex space-x-4 justify-end w-full max-lg:hidden">
                        {/* Menú de usuario */}
                        <div className="relative">
                            {token ? (
                                <div>
                                    <button
                                        className="py-2 px-4 rounded-full text-white bg-(--color-glacier-400) text-xl font-medium transition active:scale-95 hover:scale-105">
                                        <p>{usuario?.username}</p>
                                    </button>

                                    <div
                                        className="absolute right-0 mt-4 w-60 rounded-xl bg-white shadow-lg divide-y divide-gray-200">
                                        <div className="p-3">
                                            <Link className="block rounded-lg py-2 px-3 transition hover:bg-gray-100"
                                                  href={`${lang}/profile`}>
                                                <p className="font-semibold text-gray-900">{dict.CLIENT.SIDEBAR.PANEL.PROFILE}</p>
                                                <p className="text-gray-500 text-sm">{dict.CLIENT.SIDEBAR.PANEL.ACCOUNT}</p>
                                            </Link>
                                        </div>
                                        <div className="p-3">
                                            <button
                                                onClick={cerrarSesion}
                                                className="block w-full rounded-lg py-2 px-3 text-left transition hover:bg-gray-100 text-red-600 font-semibold"
                                            >
                                                {dict.CLIENT.SIDEBAR.PANEL.LOGOUT}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="py-2 px-4 rounded-full text-white bg-(--color-glacier-400) text-xl font-medium active:bg-(--color-glacier-600) transition active:scale-95 hover:scale-105"
                                    onClick={() => router.push(`/${lang}/login`)}
                                >
                                    {dict.CLIENT.SIDEBAR.LOGIN}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {menuOpen && (
                <div
                    className="absolute -right-50 -left-50 mt-4 w-96 mx-auto rounded-xl bg-white shadow-lg divide-y divide-gray-200">
                    <div className="p-3 space-y-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={`${lang}/${item.href}`}
                                className={classNames(
                                    pathname === item.href
                                        ? "underline font-bold"
                                        : "block w-full rounded-lg py-2 px-3 text-left transition hover:bg-gray-100 text-gray-900 font-semibold"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {token ? (
                            <>
                                <button
                                    className="block w-full p-3 text-left transition text-gray-900 font-bold border-y border-gray-200 ">
                                    <p>{dict.CLIENT.SIDEBAR.WELCOME}, {usuario?.username}.</p>
                                </button>
                                <div className="px-3 pb-3 border-b border-gray-200">
                                    <button
                                        onClick={() => router.push(`/${lang}/profile`)}
                                        className="block w-full rounded-lg py-2 px-3 text-left transition hover:bg-gray-100 text-gray-900 font-semibold"
                                    >
                                        {dict.CLIENT.SIDEBAR.PANEL.PROFILE}
                                        <p className="text-gray-500 text-sm">{dict.CLIENT.SIDEBAR.PANEL.ACCOUNT}</p>
                                    </button>
                                    <button
                                        onClick={cerrarSesion}
                                        className="block w-full rounded-lg py-2 px-3 text-left transition hover:bg-red-100 text-red-600 font-semibold mt-2"
                                    >
                                        {dict.CLIENT.SIDEBAR.PANEL.LOGOUT}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => router.push(`/${lang}/login`)}
                                className="block w-full rounded-lg py-2 px-3 text-left transition hover:bg-gray-100 text-gray-900 font-semibold"
                            >
                                {dict.CLIENT.SIDEBAR.LOGIN}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}