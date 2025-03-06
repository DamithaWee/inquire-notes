import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeftFromLineIcon, ArrowLeftSquare, LogOut, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useTheme } from "@/configs/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const WorkspaceHeader = ({ fileName }) => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-between items-center p-3 px-10 shadow-md bg-bgLight dark:bg-bgDark dark:shadow-zinc-200/10 gap-5">
      <Link href="/">
        <div className="flex flex-row justify-center items-center w-full gap-2">
          <Image
            src={
              theme === "dark" ? "/logo/dark-logo.svg" : "/logo/light-logo.svg"
            }
            alt="Logo"
            width={40}
            height={40}
          />
          {/* <span className="font-bold text-2xl hidden md:block">
            Inquire Notes
          </span> */}
        </div>
      </Link>
      <div className="items-center justify-center hidden md:flex gap-5">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 bg-red-300/70 hover:bg-red-200 dark:bg-red-500 dark:hover:bg-red-400/80 p-1 px-2 rounded-md cursor-pointer duration-300">
            <ArrowLeftFromLineIcon
              width={12}
              className="text-red-500 dark:text-white"
              strokeWidth={3}
            />
          </button>
        </Link>
        <h3 className="mx-auto text-3xl font-semibold ">{fileName}</h3>
      </div>
      <div className="items-center gap-5 hidden md:flex">
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

      {/* Mobile Header */}
      <div className="md:hidden backdrop:blur-xl flex items-center gap-5 ">
        <div className="flex items-center justify-center md:hidden">
          <UserButton />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <MenuIcon width={50} height={50} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 p-5 bg-zinc-900 rounded-xl backdrop:blur-md">
            <hr className="mt-5" />
            <div className="flex items-center justify-center gap-3 mt-5">
              <SunIcon width={16} className="text-white" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
              <MoonIcon width={16} className="text-white" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
