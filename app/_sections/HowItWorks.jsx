import React from "react";
import EncryptButton from "../_components/EncryptButton";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import PaperButton from "../_components/PaperButton";
import Pill from "../_components/Pill";

const HowItWorks = () => {
  const DATA = [
    {
      title: "Step 1",
      content: (
        <div className="">
          <h3 className="text-4xl font-semibold text-primaryLight dark:text-primaryDark">
            Upload Your PDF
          </h3>
          <p className="mt-5 text-sm max-w-md dark:text-zinc-300 text-zinc-700">
            Drag and drop your document or select it from your device. Inquire
            Notes supports all common PDF formats—from reports and eBooks to
            scanned documents.
          </p>
        </div>

      ),
    },
    {
      title: "Step 2",
      content: (
        <div className="">
          <h3 className="text-4xl font-semibold text-primaryLight dark:text-primaryDark">
            Ask Questions & Take Notes
          </h3>
          <p className="mt-5 text-sm max-w-md dark:text-zinc-300 text-zinc-700">
            Use our intuitive interface to ask any question about your PDF. As
            you interact with your document, add in-line notes to capture
            important details and insights.
          </p>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div className="">
          <h3 className="text-4xl font-semibold text-primaryLight dark:text-primaryDark">
            Get Instant Answers
          </h3>
          <p className="mt-5 text-sm max-w-md dark:text-zinc-300 text-zinc-700">
            Receive real-time, AI-powered responses and maintain a comprehensive
            record of your annotations for future reference.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center py-20 md:py-30">
      <div className="flex flex-col items-center">
        <Pill text="Get Started in Minutes" />
        <h2 className="text-3xl md:text-5xl font-bold text-center mt-10">
          <span className="text-primaryLight dark:text-primaryDark">How</span>{" "}
          Inquire Notes Works
        </h2>
        <p className="dark:text-zinc-300 text-zinc-400 text-xs lg:text-sm text-center mt-10">
          From setup to success in three simple steps. Here’s how you can start
          maximizing productivity right away.
        </p>
      </div>
      <div className="flex-col items-center justify-center flex">
        <Timeline data={DATA} />

        <div className="mt-24 flex flex-col items-center gap-5">
          <p className="text-zinc-400 text-sm animate-bounce">Get started by uploading your PDF</p>
          <PaperButton text="Upload PDF" href="/dashboard" />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
