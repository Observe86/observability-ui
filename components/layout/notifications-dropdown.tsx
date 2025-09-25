"use client";

import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { RiNotification3Fill } from "react-icons/ri";

import {
  getNotifications,
  getNotificationsQueryKey,
  markAllAsRead,
  markAsRead,
} from "@/api/notifications";

import { Button } from "../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { useDictionary } from "./dictionary-provider";

export const NotificationsDropdown = () => {
  const { dict } = useDictionary();

  const notificationsData = useQuery({
    queryKey: getNotificationsQueryKey,
    queryFn: getNotifications,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return markAsRead({ id });
    },
    onSettled: () => {
      notificationsData.refetch();
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSettled: () => {
      notificationsData.refetch();
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Button variant="ghost" size="icon">
              <RiNotification3Fill />
            </Button>
            {notificationsData?.data?.totalUnreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-red-400 text-white text-xs font-semibold">
                {notificationsData?.data?.totalUnreadCount > 99
                  ? "99+"
                  : notificationsData?.data?.totalUnreadCount}
              </div>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center justify-between ps-2">
              <p className="text-sm font-medium leading-none py-2">{dict?.Nav?.Notifications}</p>
              {/* {notificationsData?.totalUnreadCount > 0 && ( */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                {markAllAsReadMutation.isPending ? (
                  dict?.Shared?.Loading
                ) : (
                  <span className="flex items-center gap-1 px-0">
                    <Check /> {dict?.Nav?.MarkAllAsRead}
                  </span>
                )}
              </Button>
              {/* )} */}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {notificationsData?.data?.notifications?.content?.length ? (
              notificationsData.data?.notifications.content.map((notification: any) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={clsx(
                    "flex gap-3 p-3",
                    !notification.read ? "bg-muted font-semibold" : "bg-popover",
                  )}
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                  aria-label={`Notification: ${notification.title}`}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    {/* You can put an icon or initials here */}
                    <RiNotification3Fill />
                  </div>

                  <div className="flex flex-col flex-grow min-w-0">
                    <p className="truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-muted-foreground">
                {dict?.Shared?.NoResults}
              </p>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
