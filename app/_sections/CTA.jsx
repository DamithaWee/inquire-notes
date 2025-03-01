import React from "react";
import Pill from "../_components/Pill";
import PaperButton from "../_components/PaperButton";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const CTA = ({ theme }) => {
  return (
    <div className="flex items-center justify-center mt-20 max-w-[1200px] mx-auto px-16">
      <HoverBorderGradient
        containerClassName="rounded-xl "
        as="div"
        className={"bg-bgLight dark:bg-bgDark p-10 "}
        theme={theme}
      >
        <div className="flex items-center justify-center flex-col gap-8">
          <Pill text="Ready to get started?" />
          <div className="text-center">
            <h3 className="font-semibold text-3xl text-zinc-900 dark:text-zinc-100">
              Ready to Transform Your PDFs?
            </h3>
            <p className="text-sm font-base text-zinc-500 mt-2 ">
              Unlock insights, ask questions, and annotate instantly with
              Inquire Notes. Start for free—no credit card required!
            </p>
          </div>
          <PaperButton
            text="GET STARTED"
            href="/dashboard"
            classes={"scale-[91%] text-bold"}
          />
        </div>
      </HoverBorderGradient>
    </div>
  );
};

export default CTA;
