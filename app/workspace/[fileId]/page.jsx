"use client";

import React, { useState, useEffect } from "react";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import { useParams } from "next/navigation";
import PdfViewer from "./_components/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextEditor from "./_components/TextEditor";
import Loading from "@/app/loading";
import Split from "react-split";
import Image from "next/image";
import { FilePenLineIcon, FileText, FileTextIcon } from "lucide-react";

const Workspace = () => {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.getFileRecord, { fileId });

  // Delay handling as before
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayPassed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      setContentLoaded(true);
    } else {
      const handleLoad = () => setContentLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // State to toggle mobile view
  const [activeView, setActiveView] = useState("editor");

  if (!minDelayPassed || !contentLoaded) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <WorkspaceHeader fileName={fileInfo?.fileName} />

      {/* Mobile toggle switch */}
      <div className="md:hidden flex justify-center items-center space-x-4 p-2">
        <button
          className={`px-4 py-2 rounded ${
            activeView === "editor"
              ? "bg-primaryLight text-white "
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveView("editor")}
        >
          <FilePenLineIcon width={20} />
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeView === "pdf"
              ? "bg-primaryLight text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveView("pdf")}
        >
          <FileTextIcon width={20} />
        </button>
      </div>

      {/* Desktop Layout with draggable split */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <Split
          className="flex flex-1"
          sizes={[50, 50]}
          minSize={200}
          gutterSize={7}
          direction="horizontal"
          gutter={(index, direction) => {
            // Create a custom gutter element with flex styling
            const gutterElement = document.createElement("div");
            // Set explicit styles to ensure the icon is centered
            gutterElement.style.display = "flex";
            gutterElement.style.alignItems = "center";
            gutterElement.style.justifyContent = "center";
            gutterElement.style.width = "7px"; // match gutterSize
            gutterElement.style.height = "100%";
            gutterElement.className =
              "custom-gutter cursor-col-resize bg-zinc-500 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-gray-700 duration-300";

            // Create an icon element for the draggable indicator
            const icon = document.createElement("i");
            icon.className = "fa fa-arrows-alt-h text-gray-500";
            // Optionally set the icon size so it appears clear and centered
            icon.style.fontSize = "16px";

            // Append the icon to the gutter element
            gutterElement.appendChild(icon);
            return gutterElement;
          }}
        >
          <div className="overflow-auto">
            <TextEditor fileId={fileId} />
          </div>
          <div className="overflow-auto">
            <PdfViewer fileUrl={fileInfo?.fileUrl} />
          </div>
        </Split>
      </div>

      {/* Mobile Layout using Tailwind CSS toggling (no main page scrollbar) */}
      <div className="md:hidden flex-1 overflow-hidden">
        <div
          className={`${activeView === "editor" ? "block" : "hidden"} h-full shadow-inner`}
        >
          <TextEditor fileId={fileId} />
        </div>
        <div className={`${activeView === "pdf" ? "block" : "hidden"} h-full`}>
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
