"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { BiGroup } from "react-icons/bi";
import { GoArrowSwitch } from "react-icons/go";

import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Skeleton } from "../shadcn/skeleton";
import { useDictionary } from "./dictionary-provider";
import { useGlobalStore } from "./global-store-provider";

export const CompanySwitcher = () => {
  const { company } = useGlobalStore();
  const { dict, lang } = useDictionary();
  const router = useRouter();

  return (
    <>
      {company ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-0 sm:px-2">
              <div className="flex items-center gap-2 px-1">
                <Avatar className="h-8 w-8 border-2 border-muted">
                  {/*
                  // TODO: Change this from button to div to get rid of 'button inside button' nextjs error
                */}
                  <AvatarImage src={""} alt={company.name} />
                  <AvatarFallback>
                    <BiGroup />
                  </AvatarFallback>
                </Avatar>
                <p>{company?.name}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push(`/${lang}/application/company-settings`)}
              >
                <Settings className="w-4 h-4" />
                {dict?.Nav?.Settings}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2 px-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      )}
    </>
  );
};
