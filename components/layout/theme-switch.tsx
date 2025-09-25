"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Switch } from "@/components/shadcn/switch";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="w-4 h-4" />
      <Switch checked={isDarkMode} onCheckedChange={handleToggle} />
      <MoonIcon className="w-4 h-4" />
    </div>
  );
}
