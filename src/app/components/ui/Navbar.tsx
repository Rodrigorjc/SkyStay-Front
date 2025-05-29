"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { IoLanguage } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/app/context/DictionaryContext";
import Button from "./Button";

interface NavbarProps {
  dict?: any;
}
const getNavigation = (dict: any) => [
  { name: dict.CLIENT.SIDEBAR.FLIGHTS, href: "/flights", current: false },
  { name: dict.CLIENT.SIDEBAR.ACCOMMODATIONS, href: "/accomodations", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ dict }: NavbarProps) {
  const [usuario, setUser] = useState<{ sub: string; rol: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = getNavigation(dict);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const toggleLangMenu = () => {
    setIsLangMenuOpen(prev => !prev);
    setIsUserMenuOpen(false);
  };

  const changeLanguage = (newLang: string) => {
    const pathWithoutLang = pathname.split("/").slice(2).join("/");
    router.push(`/${newLang}/${pathWithoutLang}`);
    setIsLangMenuOpen(false);
  };

  function cerrarSesion() {
    Cookies.remove("token");
    setToken(null);
    router.push(`/${lang}`);
  }

  useEffect(() => {
    const tokenFromCookies = Cookies.get("token");
    setToken(tokenFromCookies || null);

    if (tokenFromCookies) {
      try {
        const tokenDescodificado = jwtDecode<{ sub: string; rol: string }>(tokenFromCookies);
        console.info(tokenDescodificado);
        setUser(tokenDescodificado);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const pathname = usePathname();
  const lang = useLanguage();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
    setIsLangMenuOpen(false);
  };

  return (
    <nav className="pt-3 sticky top-0 z-50">
      <motion.div
        className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-3/4 rounded-full bg-glacier-500/50 backdrop-blur-md border border-white/20 text-white "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}>
        <div className="relative flex h-16 items-center">
          <div className="max-sm:pl-3 pr-3">
            <Link className=" text-glacier-50 cursor-pointer logo " href={`/${lang}`}>
              <Image src="/favicon-white.png" alt="Logo SkyStay" width={150} height={40} className="w-auto h-auto max-sm:w-24 sm:w-28 lg:w-36" />
            </Link>
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center lg:hidden">
            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="group relative inline-flex items-center justify-center rounded-md p-2 border border-gray-300">
              <span className="sr-only">Abrir menu</span>
              {menuOpen ? <FaTimes className="block size-6 text-glacier-300" aria-hidden="true" /> : <FaBars className="block size-6 text-glacier-50" aria-hidden="true" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex md:space-x-2 space-x-5 ml-2">
            {navigation.map(item => (
              <a
                key={item.name}
                href={`${lang}/${item.href}`}
                aria-current={pathname === item.href ? "page" : undefined}
                className={classNames(pathname === item.href ? "underline text-[#0d515c]" : "text-glacier-50", "py-2 px-4 rounded-full text-xl font-medium")}>
                {item.name}
              </a>
            ))}
          </div>

          {/* User & Language Controls */}
          <div className="flex space-x-4 justify-end w-full max-lg:hidden">
            {/* User Menu */}
            <div className="relative">
              {token ? (
                <div>
                  <button onClick={toggleUserMenu} className="py-2 px-4 rounded-full text-white text-xl font-medium transition active:scale-95 hover:scale-105">
                    <p>{usuario?.sub}</p>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-4 w-64 rounded-2xl bg-[#3b5160]  border border-white/20 divide-y divide-white/20 shadow-lg text-white">
                      <div className="p-4">
                        <Link href={`${lang}/profile`} className="block rounded-lg px-4 py-2 transition-colors hover:bg-white/10">
                          <p className="font-semibold">{dict.CLIENT.SIDEBAR.PANEL.PROFILE}</p>
                          <p className="text-white/70 text-sm">{dict.CLIENT.SIDEBAR.PANEL.ACCOUNT}</p>
                        </Link>
                      </div>

                      {(usuario?.rol?.includes("ROLE_ADMIN") || usuario?.rol?.includes("ROLE_MODERATOR")) && (
                        <div className="p-4">
                          <Link href={`/${lang}/administration`} className="block rounded-lg px-4 py-2 transition-colors hover:bg-white/10">
                            <p className="font-semibold">{dict.CLIENT.SIDEBAR.PANEL.ADMIN}</p>
                            <p className="text-white/70 text-sm">{dict.CLIENT.SIDEBAR.PANEL.ADMIN_SUBTITLE}</p>
                          </Link>
                        </div>
                      )}

                      <div className="p-4">
                        <Button
                          onClick={cerrarSesion}
                          className="bg-red-500/30 hover:bg-red-500/50 active:bg-red-600/50 border border-red-400/30 text-white w-full rounded-lg px-4 py-2 transition-all"
                          text={dict.CLIENT.SIDEBAR.PANEL.LOGOUT}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button className="py-2 px-4 rounded-full text-white text-xl font-medium transition active:scale-95 hover:scale-105" onClick={() => router.push(`/${lang}/login`)}>
                  {dict.CLIENT.SIDEBAR.LOGIN}
                </button>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative mr-3">
              <button onClick={toggleLangMenu} className="py-2 px-4 rounded-full text-white text-xl font-medium transition active:scale-95 hover:scale-105 flex items-center">
                <IoLanguage className="mr-2" />
                <span className="uppercase">{lang}</span>
                <FaChevronDown className="ml-2 h-3 w-3" />
              </button>

              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-40 rounded-2xl bg-[#3b5160]  border border-white/20 divide-y divide-white/20 shadow-lg text-white">
                  <div className="p-2">
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`flex items-center w-full rounded-lg py-2 px-3 text-left transition-colors ${
                        lang === "en" ? "bg-white/10 text-white font-semibold" : "hover:bg-white/10 text-white"
                      }`}>
                      <span className="flex-1">{dict.ENGLISH}</span>
                      {lang === "en" && <span className="h-2 w-2 rounded-full bg-white/80"></span>}
                    </button>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => changeLanguage("es")}
                      className={`flex items-center w-full rounded-lg py-2 px-3 text-left transition-colors ${
                        lang === "es" ? "bg-white/10 text-white font-semibold" : "hover:bg-white/10 text-white"
                      }`}>
                      <span className="flex-1">{dict.SPANISH}</span>
                      {lang === "es" && <span className="h-2 w-2 rounded-full bg-white/80"></span>}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-96 mx-auto rounded-xl bg-[#3b5160] backdrop-blur-md border border-white/20 text-white shadow-lg">
          <div className="pt-4 px-4 space-y-3">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={`${lang}/${item.href}`}
                className={classNames(
                  pathname === item.href ? "underline font-bold text-white" : "block w-full rounded-lg py-2 px-3 text-left transition-colors hover:bg-white/10 text-white/90 font-medium"
                )}>
                {item.name}
              </Link>
            ))}

            {token ? (
              <>
                <div className="border-y border-white/10 py-3 px-3 text-white/80">
                  <p className="font-semibold">
                    {dict.CLIENT.SIDEBAR.WELCOME}, {usuario?.sub}.
                  </p>
                </div>

                <div className="px-3 pb-3 border-b border-white/10 space-y-2">
                  <Link href={`/${lang}/profile`} className="block w-full rounded-lg py-2 px-3 text-left transition-colors hover:bg-white/10 text-white/90 font-medium">
                    {dict.CLIENT.SIDEBAR.PANEL.PROFILE}
                    <p className="text-white/70 text-sm">{dict.CLIENT.SIDEBAR.PANEL.ACCOUNT}</p>
                  </Link>

                  {(usuario?.rol?.includes("ROLE_ADMIN") || usuario?.rol?.includes("ROLE_MODERATOR")) && (
                    <Link href={`/${lang}/administration`} className="block w-full rounded-lg py-2 px-3 text-left transition-colors hover:bg-white/10 text-white/90 font-medium">
                      {dict.CLIENT.SIDEBAR.PANEL.ADMIN}
                      <p className="text-white/70 text-sm">{dict.CLIENT.SIDEBAR.PANEL.ADMIN_SUBTITLE}</p>
                    </Link>
                  )}

                  <Button
                    onClick={cerrarSesion}
                    className="bg-red-500/30 hover:bg-red-500/50 active:bg-red-600/50 border border-red-400/30 block w-full rounded-lg py-2 px-3 text-white/90 transition-all"
                    text={dict.CLIENT.SIDEBAR.PANEL.LOGOUT}
                  />
                </div>
              </>
            ) : (
              <button onClick={() => router.push(`/${lang}/login`)} className="block w-full rounded-lg py-2 px-3 text-left transition-colors hover:bg-white/10 text-white/90 font-medium">
                {dict.CLIENT.SIDEBAR.LOGIN}
              </button>
            )}
          </div>

          {/* Mobile Language Switcher */}
          <div className="px-4 py-3">
            <p className="text-sm text-white/90 mb-2">{dict.CLIENT.SIDEBAR.LANGUAGE}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => changeLanguage("en")}
                className={`flex-1 py-2 px-3 rounded-lg transition-colors ${lang === "en" ? "bg-white/10 text-white font-bold" : "border border-white/20 text-white/80 hover:bg-white/10"}`}>
                English
              </button>
              <button
                onClick={() => changeLanguage("es")}
                className={`flex-1 py-2 px-3 rounded-lg transition-colors ${lang === "es" ? "bg-white/10 text-white font-bold" : "border border-white/20 text-white/80 hover:bg-white/10"}`}>
                Español
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
