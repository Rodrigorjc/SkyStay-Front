"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchDictionary } from "@dictionary";

interface DictionaryContextType {
  dict: any;
  setDict: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "es";
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{
  children: React.ReactNode;
  lang: "en" | "es";
}> = ({ children, lang }) => {
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const getDict = async () => {
      const dictionary = await fetchDictionary(lang);
      setDict(dictionary);
    };

    getDict();
  }, [lang]);

  return <DictionaryContext.Provider value={{ dict, setDict, lang }}>{children}</DictionaryContext.Provider>;
};

export const useDictionary = (): DictionaryContextType => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};

export const useLanguage = (): "en" | "es" => {
  const { lang } = useDictionary();
  return lang;
};
