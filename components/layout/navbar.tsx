/* eslint-disable @next/next/no-img-element */
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { HiLanguage } from "react-icons/hi2";
import { RiNotification3Fill } from "react-icons/ri";

import { logout } from "@/api/auth";
import { getNotifications, getNotificationsQueryKey } from "@/api/notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getApps } from "@/data/apps";
import { i18n } from "@/i18n/config";
import { NavItem } from "@/types/nav";
import { initials } from "@/utils/string";
import { clearAccessToken } from "@/utils/token";

import { Separator } from "../shadcn/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../shadcn/tooltip";
import { CompanySwitcher } from "./company-switcher";
import { useDictionary } from "./dictionary-provider";
import { useGlobalStore } from "./global-store-provider";
import { useNetworkStatus } from "./network-status-provider";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ThemeSwitch } from "./theme-switch";

export const Navbar = () => {
  const { lang, dict } = useDictionary();
  const { isOnline } = useNetworkStatus();
  const pathname = usePathname();

  const [currentNavItem, setCurrentNavItem] = useState<NavItem | null>(null);

  useEffect(() => {
    const curr = navItems.find((navItem) => pathname.includes(navItem.href)) || null;
    setCurrentNavItem(curr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const { modules, apps } = getApps({ dict, lang });
  const navItems: Array<NavItem> = [...modules, ...apps];

  const { data: notificationsData } = useQuery({
    queryKey: getNotificationsQueryKey,
    queryFn: getNotifications,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const { user } = useGlobalStore();

  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      clearAccessToken();
      router.push(`/${lang}/login`);
    },
  });

  const switchLanguage = (locale: string) => {
    const oldPath = pathname;
    const newPath = oldPath.replace(`/${lang}`, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="px-2 md:px-3 lg:px-4 h-[58px] bg-background/20 backdrop-blur-3xl flex items-center gap-3">
        {/* User Nav */}
        <div className="ms-auto flex items-center">
          {/* Current Company */}
          <div className="hidden sm:flex items-center">
            <CompanySwitcher />
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-4 mx-2" />

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Lang Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HiLanguage />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{dict?.Nav?.Language}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {i18n.supportedLocales.map((locale, index) => (
                  <DropdownMenuItem key={index} onClick={() => switchLanguage(locale)}>
                    <p className="text-sm font-medium">{dict?.Languages?.[locale] || locale}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user ? (
                <Button variant="ghost" className="relative h-8 w-8 rounded-full mx-2">
                  <Avatar className="h-8 w-8 border-2 border-muted">
                    {/* 
                    // TODO: Add user avatar
                     */}
                    <AvatarImage src={""} alt={user?.username} />
                    {/* <AvatarImage src={user?.avatar} alt={user?.email} /> */}
                    <AvatarFallback>{user?.name ? initials(user?.name) : ""}</AvatarFallback>
                  </Avatar>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={clsx(
                            "absolute -bottom-[0.1rem] -right-[0.1rem] w-2 h-2 rounded-full",
                            isOnline ? "bg-emerald-500" : "bg-gray-400",
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="text-foreground">
                          {isOnline ? dict?.Network?.Online : dict?.Network?.Offline}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Button>
              ) : (
                <Skeleton className="h-8 w-8 rounded-full mx-2" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto min-w-40" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    {user?.role == "ADMIN" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FaCrown className="text-amber-400 w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-foreground">{dict?.Shared?.Admin}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.username ? "@" + user.username : ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="sm:hidden">
                  <CompanySwitcher />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThemeSwitch />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/${lang}/application/user-settings`}>
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      {dict?.Nav?.Settings}
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                <LogOut className="w-4 h-4" />
                {dict?.Nav?.Logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
