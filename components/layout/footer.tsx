"use client";

import { useDictionary } from "./dictionary-provider";

export function Footer() {
  const { dict } = useDictionary();
  const versionTimestamp = new Date().toISOString();

  return (
    <footer className="sticky bottom-0 w-full bg-background flex text-center h-7 px-2 lg:px-10 text-sm gap-5 justify-between items-center border-t">
      <p className="text-xs text-muted-foreground">{dict?.Footer?.Copyright}</p>
      <p className="text-xs text-muted-foreground uppercase">Beta - {versionTimestamp}</p>
      {/* <div className="flex gap-5">
          <Link href={`/${lang}/terms-and-conditions`}>{dict?.TermsAndConditions?.Title}</Link>
          <Link href={`/${lang}/privacy-policy`}>{dict?.PrivacyPolicy?.Title}</Link>
        </div> */}
    </footer>
  );
}
