"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const Dashboard = () => {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const createUser = useMutation(api.user.CreateUser);

  // Only create a user if user exists & is logged in
  useEffect(() => {
    if (user) {
      createUser({
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
        username: user?.fullName,
      });
    }
  }, [user, createUser]);

  return (
    <div>
      <h2 className="font-medium text-3xl">Workspace</h2>

      <div className="flex flex-col gap-5 mt-10">
        <div className="flex justify-between px-2 text-sm text-zinc-800/50 dark:text-zinc-500 font-semibold">
          <p>Document Name</p>
          <p>Date Created</p>
        </div>
        {fileList?.length > 0
          ? fileList?.map((file, index) => (
              <Link href={`/workspace/${file.fileId}`} key={index}>
                <div
                  className="flex gap-5 p-5 shadow-md dark:shadow-zinc-800 rounded-md border dark:border-zinc-700 cursor-pointer
                hover:bg-slate-100 dark:hover:bg-[#1b1b1b] hover:scale-[99%] transition duration-300
                "
                >
                  {/* <FileTextIcon width={60} height={60} className="text-primaryLight dark:text-primaryDark" /> */}
                  <Image
                    src={"/pdf.png"}
                    width={50}
                    height={50}
                    alt="pdf icon"
                    className=""
                  />

                  <div className="flex items-center justify-between w-full ">
                    <h2 className="font-medium text-lg">{file.fileName}</h2>
                    <h2 className="text-zinc-800/50 dark:text-zinc-500">
                      {new Date(file._creationTime).toLocaleDateString()}
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="bg-slate-200 dark:bg-zinc-800 rounded-md h-[100px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default Dashboard;
