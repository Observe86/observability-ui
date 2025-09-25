"use client";

import { GrInProgress } from "react-icons/gr";

import { useDictionary } from "../layout/dictionary-provider";
import { Alert, AlertDescription, AlertTitle } from "../shadcn/alert";

export const ComingSoon = () => {
  const { dict } = useDictionary();

  return (
    <Alert className="max-w-max">
      <GrInProgress className="h-4 w-4" />
      <AlertTitle>{dict?.Shared?.ComingSoon}</AlertTitle>
      <AlertDescription className="text-muted-foreground text-wrap max-w-lg">
        {dict?.Shared?.ComingSoonDescription}
      </AlertDescription>
    </Alert>
  );
};
