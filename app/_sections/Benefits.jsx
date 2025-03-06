import React from "react";
import Pill from "../_components/Pill";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { FileQuestion, FileSearch, Workflow } from "lucide-react";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/ui/CardAnimated";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const BENEFITS = [
  {
    title: "Instant Document Insights",
    description:
      "Quickly extract key information from lengthy PDFs, saving time and boosting productivity.",
    icon: <FileSearch width={40} height={40} />,
  },

  {
    title: "AI-Powered Q&A & Note-Taking",
    description:
      "Ask questions on the fly and annotate your document with in-context notes to capture insights as you learn.",
    icon: <FileQuestion width={40} height={40} />,
  },
  {
    title: "Streamlined Workflow Integration",
    description:
      "Seamlessly incorporate Inquire Notes into your daily routine for smarter research, study sessions, or work collaborations.",
    icon: <Workflow width={40} height={40} />,
  },
];

const Benefits = ({ theme }) => {
  return (
    <div className="py-20 md:py-30">
      <div className="container">
        <div className="flex flex-col items-center">
          <Pill text="Why Use Inquire Notes?" />
          <h2 className="text-3xl md:text-5xl font-bold text-center mt-10">
            Feature Tell, But{" "}
            <span className="text-primaryLight dark:text-primaryDark">
              Benefits
            </span>{" "}
            Sell
          </h2>
          <p className="dark:text-zinc-300 text-zinc-400 text-xs lg:text-sm text-center mt-10">
            Inquire Notes is more than a document reader—it's your personal
            assistant for smarter learning and efficient organization. Discover
            how:
          </p>
        </div>

        <div className="flex md:flex-row flex-col gap-5 md:gap-10 w-full items-center justify-center mt-10">
          {BENEFITS.map((benefit, index) => (
            <CardContainer key={index}>
              <HoverBorderGradient
                containerClassName="rounded-xl"
                as="card-body"
                className={"bg-bgLight dark:bg-bgDark"}
                theme={theme}
              >
                <CardBody
                  className={
                    "bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-between h-80 lg:w-64 md:w-52 w-64 rounded-xl p-10 cursor-default"
                  }
                >
                  <CardItem
                    translateZ={"50"}
                    className={"text-primaryLight dark:text-primaryDark"}
                  >
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-5 drop-shadow-xl">
                      {benefit.icon}
                    </div>
                  </CardItem>

                  <CardItem
                    translateZ={"70"}
                    className={
                      "mt-5 text-center font-bold text-primaryLight dark:text-primaryDark"
                    }
                    as="h3"
                  >
                    {benefit.title}
                  </CardItem>

                  <CardItem
                    translateZ={"50"}
                    className={"mt-5 text-xs text-center text-zinc-500 "}
                    as="p"
                  >
                    {benefit.description}
                  </CardItem>
                </CardBody>
              </HoverBorderGradient>
            </CardContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
