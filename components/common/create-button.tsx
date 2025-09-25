"use client";

import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/shadcn/button";

import { useDictionary } from "../layout/dictionary-provider";

export const CreateButton = ({
  onClick,
  text,
}: {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text?: string;
}) => {
  const { dict } = useDictionary();

  return (
    <Button variant="outline" onClick={onClick}>
      <IoAdd size={30} className="text-primary" />
      {text || dict?.Shared?.New}
    </Button>
  );
};
