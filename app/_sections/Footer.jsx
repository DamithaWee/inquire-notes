import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PaperButton from "../_components/PaperButton";

const Footer = ({ theme }) => {
  return (
    <div className="pt-32 container flex items-center justify-center flex-col mb-5">
      <HoverBorderGradient
        containerClassName="rounded-xl"
        as="div"
        className="bg-bgDark"
        theme={theme}
      >
        <div className="px-16 md:px-24 py-8 flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-28 w-full xl:w-[1200px] max-w-[1200px]">
          {/* Left Section: Logo & CTA */}
          <div className="flex flex-col">
            <div className="flex items-center justify-center gap-5">
              <Image
                src={
                  theme === "dark"
                    ? "/logo/dark-logo.svg"
                    : "/logo/light-logo.svg"
                }
                alt="Inquire Notes logo"
                width={40}
                height={40}
              />
              <span className="text-2xl font-medium hidden md:block">
                Inquire Notes
              </span>
            </div>
            <div className="mt-8 ml-0 md:ml-10">
              <PaperButton
                text="GET STARTED"
                href="/dashboard"
                classes="scale-[91%] font-bold"
              />
            </div>
          </div>

          {/* Right Section: Navigation */}
          <div className="flex flex-col md:flex-row justify-end gap-10 md:gap-20 mr-0 md:mr-20 text-center md:text-left">
            <nav aria-label="Sitemap" className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Sitemap</h3>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link href="/" className="hover:text-zinc-50">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-zinc-400">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-zinc-400">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-zinc-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Tools">
              <h3 className="text-lg font-semibold mb-2">Tools</h3>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link href="/ai-notes" className="hover:text-zinc-400">
                    AI Notes
                  </Link>
                </li>
                {/* Additional tools can be added here */}
              </ul>
            </nav>
          </div>
        </div>

        <hr className="border-t border-gray-300 dark:border-gray-700" />

        <div className="py-5 text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} Inquire Notes. All rights
            reserved.
          </p>
        </div>
      </HoverBorderGradient>
    </div>
  );
};

export default Footer;
