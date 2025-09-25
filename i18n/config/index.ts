export const en = "en";
export const ar = "ar";

export type SupportedLocale = typeof en | typeof ar;

export const i18n = {
  supportedLocales: [en],
  defaultLocale: en,
};

/**
 * Check if the locale is RTL
 * @param locale the locale to check
 * @returns true if the locale is RTL
 */
export function isRTL(locale: string): boolean {
  return locale === ar;
}
