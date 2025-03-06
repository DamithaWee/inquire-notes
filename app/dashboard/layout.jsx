"use client";
import React, { useState, useEffect } from "react";
import SidebarSection from "./_components/SidebarSection";
import Header from "./_components/Header";
import Loading from "../loading";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }) => {
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayPassed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Check if the window has fully loaded.
  useEffect(() => {
    // If the page is already loaded, update the state immediately.
    if (document.readyState === "complete") {
      setContentLoaded(true);
    } else {
      const handleLoad = () => setContentLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Show the loading animation if either condition isn't met.
  if (!minDelayPassed || !contentLoaded) {
    return <Loading />;
  }

  return (
    <SidebarProvider>
      {/* <div className="md:w-64 h-screen fixed"> */}
      <SidebarSection />
      {/* </div> */}
      <div className="w-full">
        <div className="fixed pt-5 cursor-pointer">
          <SidebarTrigger className="">Sidebar</SidebarTrigger>
        </div>
        <Header />
        <div className="p-10">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
