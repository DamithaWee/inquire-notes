import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/configs/ThemeContext";
import { Suspense } from "react";
import Loading from "./loading";
import LoadingAnimation from "@/components/LoadingAnimation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inquire Notes",
  description:
    "Inquire Notes transforms your PDFs into interactive experiences. Upload, ask questions, and take notes with our AI-powered tool to unlock valuable insights instantly.",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <ClerkProvider>
        <html lang="en" className="scroll-smooth">
          <body
            className={`${inter.className} antialiased bg-bgLight dark:bg-bgDark`}
          >
            <Provider>
              <Suspense fallback={<LoadingAnimation />}>{children}</Suspense>
            </Provider>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </ThemeProvider>
  );
}
