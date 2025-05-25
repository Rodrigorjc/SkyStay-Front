"use client";
import { DictionaryProvider, useDictionary } from "@/app/context/DictionaryContext";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { LuLockKeyhole } from "react-icons/lu";
import { useRouter } from "next/navigation";

const ForbiddenContent = () => {
  const { dict } = useDictionary();
  const router = useRouter();

  if (!dict) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center px-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-600/20 p-4 rounded-full border border-yellow-500/30">
            <LuLockKeyhole className="text-yellow-400 w-12 h-12" />
          </div>
        </div>
        <div className="text-white mb-3 tracking-tight font-extrabold flex flex-col items-center gap-4">
          <h1 className="text-5xl">403</h1>
          <h1 className="text-3xl">{dict.FORBIDDEN.TITLE}</h1>
        </div>
        <p className="text-gray-300 mb-6">{dict.FORBIDDEN.SUBTITLE}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition px-5 py-2 rounded-full text-sm font-medium">
          {dict.FORBIDDEN.BUTTON}
        </button>
      </div>
    </div>
  );
};

const Forbidden = () => {
  const pathname = usePathname();
  const lang = (["en", "es"].includes(pathname.split("/")[1]) ? pathname.split("/")[1] : "en") as "en" | "es";

  return (
    <DictionaryProvider lang={lang}>
      <ForbiddenContent />
    </DictionaryProvider>
  );
};

export default Forbidden;
