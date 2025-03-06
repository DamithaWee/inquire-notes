"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Header from "./_components/Header";
import Hero from "./_sections/Hero";
import { useTheme } from "@/configs/ThemeContext";
import Benefits from "./_sections/Benefits";
import HowItWorks from "./_sections/HowItWorks";
import Pricing from "./_sections/Pricing";
import CTA from "./_sections/CTA";
import Footer from "./_sections/Footer";
import Loading from "./loading";

export default function Home() {
  const { user } = useUser();
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

  const { theme } = useTheme();

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
    <div className=" ">
      {/* Fixed Navbar */}
      <div className="fixed flex justify-center items-center w-[90vw] left-1/2 transform -translate-x-1/2 z-50">
        <Header />
      </div>

      {/* Hero Section */}
      <section id="home">
        <Hero theme={theme} />
      </section>
      {/* 
      <div className="">
        <Demo />
      </div> */}

      {/* Benefits Section */}
      <section id="features">
        <Benefits theme={theme} />
      </section>

      {/* How It Works Section */}
      <section>
        <HowItWorks />
      </section>

      <section id="pricing">
        <Pricing theme={theme} />
      </section>

      {/* <section>
        <FAQSection />
      </section> */}

      <section>
        <CTA theme={theme} />
      </section>

      <footer>
        <Footer theme={theme} />
      </footer>
    </div>
  );
}
