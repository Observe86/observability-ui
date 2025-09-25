"use client";

import { createContext, useContext } from "react";

import { SupportedLocale } from "@/i18n/config";

type DictionaryContextType = {
  lang: SupportedLocale;
  dict: any;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{
  children: React.ReactNode;
  lang: SupportedLocale;
  dict: any;
}> = ({ children, lang, dict }) => {
  return <DictionaryContext.Provider value={{ lang, dict }}>{children}</DictionaryContext.Provider>;
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};
