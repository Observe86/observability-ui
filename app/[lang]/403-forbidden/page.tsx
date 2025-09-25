import Link from "next/link";

import { SupportedLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

interface IProps {
  params: Promise<{ lang: SupportedLocale }>;
}

export default async function Page({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h2 className="font-bold text-[12rem] leading-[90%]">403</h2>
      <h2 className="font-bold text-4xl mb-3">{dict?.Forbidden?.Title}</h2>
      <p className="mb-5">{dict?.Forbidden?.Description}</p>
      <Link
        href={`/${lang}/application/home`}
        className="bg-primary py-2 px-10 text-primary-foreground rounded-md"
      >
        {dict?.Forbidden?.BackToHome}
      </Link>
    </div>
  );
}
