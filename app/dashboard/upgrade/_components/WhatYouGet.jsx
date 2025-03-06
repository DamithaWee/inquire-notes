import React from "react";
import HoverCard from "./HoverCard";
import { Image } from "lucide-react";

const WhatYouGet = () => {
  return (

      <div className="container flex flex-col md:flex-row md:gap-10 gap-2 mt-10 items-center justify-center px-15 w-full">
        <HoverCard title="Unlimited PDFs" />
        <HoverCard title="Unlimited Q&A" />
        <HoverCard title="Unlimited Notes" />
      </div>

  );
};

export default WhatYouGet;

