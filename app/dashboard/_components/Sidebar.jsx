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

const Sidebar = () => {
  const { user } = useUser();
  const path = usePathname();
  const { theme } = useTheme();

  const getUserInfo = useQuery(api.user.getUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  console.log(fileList?.length >= 5 && getUserInfo.upgrade);

  return (
    <div className="shadow-md bg-bgLight dark:bg-bgDark dark:shadow-zinc-200/10 h-screen p-7">
      <Link href="/">
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <Image
            src={
              theme === "dark" ? "/logo/dark-logo.svg" : "/logo/light-logo.svg"
            }
            alt="Logo"
            width={60}
            height={60}
          />
          <span className="font-bold text-2xl">Inquire Notes</span>
        </div>
      </Link>

      <div className="mt-10">
        <UploadPdfDialog
          isMaxFile={fileList?.length >= 5 && getUserInfo?.upgrade}
        >
          <PaperButton text="+ Upload PDF" />
        </UploadPdfDialog>

        <Link href={"/dashboard"}>
          <div
            className={`flex gap-2 items-center mt-5 hover:bg-slate-100 rounded-lg cursor-pointer p-3 
                ${path == "/dashboard" ? "bg-zinc-800 text-white hover:bg-zinc-700" : ""}
                `}
          >
            <LayoutDashboardIcon />
            <h2>Workspace</h2>
          </div>
        </Link>

        <Link href={"/dashboard/upgrade"}>
          <div
            className={`flex gap-2 items-center mt-5 hover:bg-slate-100 rounded-lg cursor-pointer p-3
                ${path == "/dashboard/upgrade" ? "bg-zinc-800 text-white hover:bg-zinc-700" : ""}
                `}
          >
            <ShieldIcon />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>

      {!getUserInfo?.upgrade && (
        <div className="absolute bottom-24 w-[80%]">
          <Progress value={((fileList?.length || 0) / 5) * 100} />
          <p className="text-sm mt-2">
            {fileList?.length || 0} out of 5 PDF uploaded
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Upgrade to Pro to upload unlimited PDFs
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
