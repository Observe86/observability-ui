"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { buttonVariants } from "@/components/shadcn/button";
import { cn } from "@/utils/shadcn";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  itemGroups: {
    title: string;
    items: {
      href: string;
      title: string;
      icon?: React.ReactNode;
    }[];
  }[];
}

export function SettingsSidebarNav({ className, itemGroups, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex gap-x-2 lg:flex-col lg:gap-x-0 lg:gap-y-1 flex-wrap", className)}
      {...props}
    >
      {itemGroups.map((itemGroup, index) => (
        <div key={index} className="flex flex-col mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{itemGroup.title}</h3>
          {itemGroup.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-primary/5 hover:bg-primary/5 text-primary hover:text-primary"
                  : "hover:bg-transparent hover:underline",
                "justify-start px-2",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
