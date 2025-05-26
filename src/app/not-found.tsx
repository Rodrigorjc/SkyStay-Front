"use client";
import "./globals.css";
import { DictionaryProvider, useDictionary } from "@/app/context/DictionaryContext";
import { usePathname } from "next/navigation";
import React from "react";
import { LuLockKeyhole } from "react-icons/lu";

const NotFoundContent = () => {
  const { dict } = useDictionary();

  if (!dict) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center px-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600/20 p-4 rounded-full border border-red-500/30">
            <LuLockKeyhole className="text-red-400 w-12 h-12" />
          </div>
        </div>
        <div className="text-white mb-3 tracking-tight font-extrabold flex flex-col items-center gap-4">
          <h1 className="text-5xl">404</h1>
          <h1 className="text-3xl ">{dict.NOT_FOUND.TITLE}</h1>
        </div>
        <p className="text-gray-300 mb-6">{dict.NOT_FOUND.SUBTITLE}</p>
        <button
          onClick={() => window.history.back()}
          className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition px-5 py-2 rounded-full text-sm font-medium">
          {dict.NOT_FOUND.BUTTON}
        </button>
      </div>
    </div>
  );
};

const NotFound = () => {
  const pathname = usePathname();
  const lang = (["en", "es"].includes(pathname.split("/")[1]) ? pathname.split("/")[1] : "en") as "en" | "es";

  return (
    <DictionaryProvider lang={lang}>
      <NotFoundContent />
    </DictionaryProvider>
  );
};

export default NotFound;
