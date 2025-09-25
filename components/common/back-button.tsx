"use client";

import { useRouter } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";

import { isRTL } from "@/i18n/config";

import { useDictionary } from "../layout/dictionary-provider";
import { Button } from "../shadcn/button";

export const BackButton = () => {
  const router = useRouter();
  const { lang } = useDictionary();

  return (
    <Button onClick={() => router.back()} size="icon" variant="outline">
      {isRTL(lang) ? (
        <MdOutlineArrowBack style={{ transform: "rotate(180deg)" }} />
      ) : (
        <MdOutlineArrowBack />
      )}
    </Button>
  );
};
