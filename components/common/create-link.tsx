"use client";

import Link from "next/link";
import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/shadcn/button";

import { useDictionary } from "../layout/dictionary-provider";

export const CreateLink = ({ href, text }: { href: string; text?: string }) => {
  const { dict } = useDictionary();

  return (
    <Link href={href}>
      <Button variant="outline">
        <IoAdd size={30} className="text-green-500" />
        {text || dict?.Shared?.New}
      </Button>
    </Link>
  );
};
