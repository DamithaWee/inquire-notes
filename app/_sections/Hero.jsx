"use client";

import React from "react";
import Waves from "../_components/Waves/Waves";
import { useTheme } from "@/configs/ThemeContext";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import EncryptButton from "../_components/EncryptButton";
import PaperButton from "../_components/PaperButton";


const Hero = ({theme}) => {
  
  const lineColor = theme === "dark" ? "#fff" : "#000";

  return (
    <div className="w-full rounded-md flex items-center justify-center py-36 md:py-52 lg:py-72 relative antialiased bg-grid-white/[0.02] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)] ">
      {/* <Spotlight className="-top-60 " fill="white" /> */}

      <div className="dark:opacity-5 opacity-10 inset-0 -z-10 ">
        <Waves lineColor={lineColor} />
      </div>

      <div className="container flex items-center justify-center flex-col">
        <h1 className="lg:text-7xl md:text-5xl text-3xl font-bold text-center max-w-5xl">
          <span className="text-primaryLight dark:text-primaryDark">
            Effortless{" "}
          </span>
          note-taking from your PDFs
        </h1>

        <p className="text-zinc-400 text-xs lg:text-sm text-center mt-10 md:px-36 px-20">
          Transform your PDFs into dynamic, interactive documents. Upload any
          PDF, ask questions, and take contextual notes—all powered by advanced
          AI to unlock valuable insights.
        </p>

        <div className="mt-32 relative">
          <PaperButton text="Get Started" href="/dashboard" classes={'z-10'}/>
          {/* <div className="absolute inset-0 rounded-lg bg-primaryLight dark:bg-primaryDark opacity-15 animate-ping -z-10"/> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
