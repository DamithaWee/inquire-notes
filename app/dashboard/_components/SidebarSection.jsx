"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboardIcon, ShieldIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import UploadPdfDialog from "./UploadPdfDialog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/configs/ThemeContext";
import PaperButton from "@/app/_components/PaperButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const SidebarSection = () => {
  const { user } = useUser();
  const path = usePathname();
  const { theme } = useTheme();

  const getUserInfo = useQuery(api.user.getUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <Sidebar className="bg-bgLight dark:bg-bgDark">
      <SidebarHeader className="bg-bgLight dark:bg-bgDark">
        <Link href="/">
          <div className="flex flex-col justify-center items-center w-full gap-2 mt-3">
            <Image
              src={
                theme === "dark"
                  ? "/logo/dark-logo.svg"
                  : "/logo/light-logo.svg"
              }
              alt="Logo"
              width={60}
              height={60}
            />
            <span className="font-bold text-2xl">Inquire Notes</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-bgLight dark:bg-bgDark">
        <div className="mt-10 mx-auto">
          <SidebarGroup>
            <UploadPdfDialog
              isMaxFile={fileList?.length >= 5 && !getUserInfo?.upgrade}
            >
              <PaperButton text="+ Upload PDF" />
            </UploadPdfDialog>
          </SidebarGroup>
          <SidebarGroup>
            <Link href={"/dashboard"}>
              <div
                className={`flex gap-2 items-center mt-5 hover:bg-slate-100 dark:hover:bg-[#1b1b1b] rounded-lg cursor-pointer p-3 py-4 duration-300 border dark:border-zinc-700
                ${path == "/dashboard" ? "bg-[#1f201f] text-white hover:bg-zinc-700 dark:hover:bg-[#1b1b1b]" : ""}
                `}
              >
                <LayoutDashboardIcon />
                <h2>Workspace</h2>
              </div>
            </Link>

            <Link href={"/dashboard/upgrade"}>
              <div
                className={`flex gap-2 items-center mt-5 hover:bg-slate-100 dark:hover:bg-[#1b1b1b] rounded-lg cursor-pointer p-3 py-4  border  dark:border-zinc-700
                ${path == "/dashboard/upgrade" ? "bg-[#1f201f] text-white hover:bg-zinc-700 dark:hover:bg-[#1b1b1b]" : ""}
                `}
              >
                <ShieldIcon />
                <h2>Upgrade</h2>
              </div>
            </Link>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter className="bg-bgLight dark:bg-bgDark">
        {!getUserInfo?.upgrade && (
          <div className="mx-auto mb-5 w-[80%]">
            <Progress value={((fileList?.length || 0) / 5) * 100} />
            <p className="text-sm mt-2">
              {fileList?.length || 0} out of 5 PDF uploaded
            </p>
            <p className="text-xs mt-2 text-gray-400">
              Upgrade to Pro to upload unlimited PDFs
            </p>
          </div>
        )}
      </SidebarFooter>
      {/* <SidebarRail/> */}
    </Sidebar>
  );
};

export default SidebarSection;
