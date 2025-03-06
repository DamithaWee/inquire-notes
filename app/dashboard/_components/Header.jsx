"use client";
import { useTheme } from "@/configs/ThemeContext";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-end p-5 px-10 shadow-md bg-bgLight dark:bg-bgDark dark:shadow-zinc-200/10 gap-5 ">
      
      <div className="flex items-center gap-2 justify-between px-2">
        <SunIcon width={16} />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <MoonIcon width={16} />
      </div>
      <UserButton />
    </div>
  );
};

export default Header;
