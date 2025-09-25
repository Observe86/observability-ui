"use client";

import clsx from "clsx";
import { BookText, HelpCircle, Lock, Settings, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";

import { useDictionary } from "./dictionary-provider";

export const AppSidebar = () => {
  const pathname = usePathname();
  const { lang, dict } = useDictionary();

  const navLinks = [
    {
      href: `/${lang}/application/home`,
      icon: MdDashboard,
      label: dict?.Nav?.Home,
    },
    {
      href: `/${lang}/application/vendor-management`,
      icon: ShoppingCart,
      label: dict?.Nav?.Vendors,
    },
    {
      href: `/${lang}/application/client-management`,
      icon: Store,
      label: dict?.Nav?.Clients,
    },
    {
      href: `/${lang}/application/inquiry-management`,
      icon: BookText,
      label: dict?.Nav?.Inquiries,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 h-screen w-12 bg-gradient-to-b from-teal-400 to-rose-600 border-sidebar-border flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="mb-8">
          <Link
            href={`/${lang}/application/home`}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition"
          >
            <Lock className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>

      {/* Main nav icons */}
      <div className="flex flex-col items-center flex-grow pt-4 w-full">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all",
              )}
            >
              <Icon
                className={clsx(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-white group-hover:text-white",
                )}
              />
            </Link>
          );
        })}
      </div>

      {/* Company Settings and Help */}
      <div className="flex flex-col items-center pb-4 w-full">
        <Link
          href={`/${lang}/application/company-settings`}
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition"
        >
          <Settings
            className={clsx(
              "h-5 w-5 transition-colors",
              pathname.startsWith(`/${lang}/application/company-settings`)
                ? "text-white"
                : "text-white group-hover:text-white",
            )}
          />
        </Link>

        {/* <Link
          href="/help"
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition"
        >
          <HelpCircle
            className={clsx(
              "h-5 w-5 transition-colors",
              pathname === "/help" ? "text-white" : "text-zinc-400 group-hover:text-white",
            )}
          />
        </Link> */}
      </div>
    </nav>
  );
};
