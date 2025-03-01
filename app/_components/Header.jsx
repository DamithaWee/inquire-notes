"use client";

import React from "react";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { useTheme } from "@/configs/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Menu as MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border border-gray-200 bg-zinc-900/80 text-white flex items-center justify-between backdrop-blur max-w-[90vw] mt-5 w-full h-15 py-3 px-10 rounded-2xl">
      {/* Logo */}
      <div className="flex items-center gap-5">
        <Image
          src={
            theme === "dark" ? "/logo/dark-logo.svg" : "/logo/light-logo.svg"
          }
          alt="Logo"
          width={40}
          height={40}
        />
        <span className="text-2xl font-medium hidden md:block">
          Inquire Notes
        </span>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
        <Navbar />
      </nav>

      {/* Theme Toggle */}
      <div className="hidden md:flex items-center gap-4">
        <SunIcon className="w-5 h-5 text-white" />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <MoonIcon className="w-5 h-5 text-white" />
      </div>

      {/* <div>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div> */}

      {/* Mobile Menu */}
      <div className="md:hidden backdrop:blur-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <MenuIcon size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 p-5 bg-zinc-900/90 rounded-xl backdrop:blur-xl">
            <div className="border-b border-gray-200 pb-2 mb-2">
              <Navbar isMobile />
            </div>
            <div className="flex items-center justify-between px-2">
              <SunIcon width={16} />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
              <MoonIcon width={16} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
