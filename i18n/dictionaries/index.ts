import "server-only";

import { SupportedLocale } from "../config";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  ar: () => import("./ar.json").then((module) => module.default),
};

export const getDictionary = async (locale: SupportedLocale): Promise<any> => {
  return dictionaries[locale]();
};
