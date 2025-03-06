"use client";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  EditorContent,
  useEditor,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  BoldIcon,
  ItalicIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  ListIcon,
  CodeIcon,
  Strikethrough,
  Sparkles,
  SaveIcon,
  DownloadIcon,
  MenuIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { openRouterModel } from "@/configs/AIModel";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loading from "@/app/loading";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
require("dotenv").config();

const MenuBar = ({ editor }) => {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.getFileRecord, { fileId });
  const SearchAi = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();
  const [isLoadingAnswer, setLoadingAnswer] = useState(false);

  const menuClasses =
    "flex flex-col items-center justify-center font-bold rounded-md p-1 md:px-2 duration-300";

  const menuIconActiveClasses =
    "is-active bg-zinc-200/20 text-primaryLight dark:text-primaryDark";

  const menuIconClasses = "hover:bg-zinc-200 dark:hover:bg-zinc-200/10";

  const toolTipClass =
    "outline outline-1 outline-zinc-300 dark:outline-zinc-700 rounded-sm px-2 py-1 bg-zinc-100 dark:bg-zinc-800";

  const onAiClick = async () => {
    if (editor.state.selection.empty) {
      alert("No text selected. Please select some text to generate an answer.");
      return;
    }

    setLoadingAnswer(true);
    toast("Generating Answer");

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ""
    );

    const result = await SearchAi({
      query: selectedText,
      fileId: fileId,
    });

    const unformattedResult = JSON.parse(result);
    let answer = "";
    unformattedResult &&
      unformattedResult.forEach((item) => {
        answer += item.pageContent;
      });

    const cleanAnswer = answer.trim().replace(/\n\s*\n/g, " ");

    const PROMPT = `
You are an intelligent note creation assistant that extracts context from a PDF document and generates a concise HTML answer to the question: "${selectedText}". Use the provided content "${cleanAnswer}" as your primary reference and incorporate any relevant, up-to-date online information if needed. Your final output should consist solely of valid, semantic HTML markup that directly answers the question without repeating it. Do not include extra commentary, headings, source citations, or unnecessary details. Return only the final HTML code.
`;

    const aiModelResult = await openRouterModel.chat.completions.create({
      model: "google/gemini-2.0-pro-exp-02-05:free",
      messages: [{ role: "user", content: PROMPT }],
    });

    const aiResponse = aiModelResult.choices[0].message.content
      .replace("```", "")
      .replace("html", "")
      .replace("```", "")
      .trim();

    const { to } = editor.state.selection;
    editor.commands.setTextSelection(to);
    editor.commands.insertContent(
      `<p><strong>Answer: </strong>${aiResponse}</p>`,
      { parseOptions: { preserveWhitespace: false } }
    );

    setLoadingAnswer(false);
    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
  };

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const onDownloadNote = () => {
    if (!editor) return;

    toast("Generating PDF...");

    const content = editor.getJSON();

    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Define colors and layout settings
    const colors = {
      primary: [41, 128, 185],
      secondary: [52, 152, 219],
      text: [0, 0, 0],
      background: [240, 248, 255],
    };
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let currentY = margin;
    const lineHeight = 7;
    const blockSpacing = 2; // Reduced block spacing
    const bulletIndent = 5;

    // Set the page background color
    doc.setFillColor(...colors.background);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Function to render text blocks with wrapping and alignment support
    const renderText = (text, options = {}, indent = 0, alignment = "left") => {
      if (options.bold && options.italic) {
        doc.setFont("helvetica", "bolditalic");
      } else if (options.bold) {
        doc.setFont("helvetica", "bold");
      } else if (options.italic) {
        doc.setFont("helvetica", "italic");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(options.fontSize || 10);
      doc.setTextColor(...colors.text);

      const maxWidth = pageWidth - margin * 2 - indent;
      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line) => {
        const lineWidth = doc.getTextWidth(line);
        let xPos = margin + indent;
        if (alignment === "center") {
          xPos = (pageWidth - lineWidth) / 2;
        } else if (alignment === "right") {
          xPos = pageWidth - margin - lineWidth;
        }
        if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, xPos, currentY);
        currentY += lineHeight;
      });
    };

    // Merge adjacent text nodes with the same formatting
    const mergeTextNodes = (nodes) => {
      const merged = [];
      nodes.forEach((node) => {
        const marks = node.marks || [];
        const style = {
          bold: marks.some((m) => m.type === "bold"),
          italic: marks.some((m) => m.type === "italic"),
          fontSize:
            marks.find((m) => m.type === "textStyle")?.attrs?.fontSize || 10,
        };
        if (merged.length > 0) {
          const last = merged[merged.length - 1];
          if (
            last.bold === style.bold &&
            last.italic === style.italic &&
            last.fontSize === style.fontSize
          ) {
            last.text += node.text;
            return;
          }
        }
        merged.push({ text: node.text, ...style });
      });
      return merged;
    };

    // Render inline rich text within a paragraph. If a fragment is too wide for the remaining space,
    // it is split and rendered on new lines so that no text is cut off.
    const renderInlineRichParagraph = (nodes, alignment = "left") => {
      const fragments = mergeTextNodes(nodes);
      let totalWidth = 0;
      fragments.forEach((frag) => {
        if (frag.bold && frag.italic) {
          doc.setFont("helvetica", "bolditalic");
        } else if (frag.bold) {
          doc.setFont("helvetica", "bold");
        } else if (frag.italic) {
          doc.setFont("helvetica", "italic");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(frag.fontSize);
        totalWidth += doc.getTextWidth(frag.text);
      });
      let startX = margin;
      if (alignment === "center") {
        startX = (pageWidth - totalWidth) / 2;
      } else if (alignment === "right") {
        startX = pageWidth - margin - totalWidth;
      }
      let currentX = startX;

      fragments.forEach((frag) => {
        if (frag.bold && frag.italic) {
          doc.setFont("helvetica", "bolditalic");
        } else if (frag.bold) {
          doc.setFont("helvetica", "bold");
        } else if (frag.italic) {
          doc.setFont("helvetica", "italic");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(frag.fontSize);
        let fragText = frag.text;
        let fragWidth = doc.getTextWidth(fragText);
        let availableWidth = pageWidth - margin - currentX;
        if (fragWidth <= availableWidth) {
          doc.text(fragText, currentX, currentY);
          currentX += fragWidth;
        } else {
          // Split the fragment for the remaining space on the current line.
          const splitCurrent = doc.splitTextToSize(fragText, availableWidth);
          if (splitCurrent.length > 0) {
            doc.text(splitCurrent[0], currentX, currentY);
          }
          currentY += lineHeight;
          // Re-split using full line width for the remaining text.
          const splitFull = doc.splitTextToSize(
            fragText,
            pageWidth - margin * 2
          );
          // Avoid duplicating the first rendered part.
          const remainingLines =
            splitFull[0] === splitCurrent[0] ? splitFull.slice(1) : splitFull;
          remainingLines.forEach((line) => {
            const lineWidth = doc.getTextWidth(line);
            let newX = margin;
            if (alignment === "center") {
              newX = (pageWidth - lineWidth) / 2;
            } else if (alignment === "right") {
              newX = pageWidth - margin - lineWidth;
            }
            doc.text(line, newX, currentY);
            currentY += lineHeight;
          });
          currentX = margin;
        }
      });
      currentY += lineHeight;
    };

    // Traverse the editor's JSON structure and render nodes
    const traverseContent = (node, indentLevel = 0) => {
      if (node.type === "doc") {
        node.content?.forEach((child) => traverseContent(child, indentLevel));
      } else if (node.type === "paragraph") {
        const alignment = node.attrs?.textAlign || "left";
        if (node.content && node.content.length > 1) {
          const textNodes = node.content.filter(
            (child) => child.type === "text"
          );
          renderInlineRichParagraph(textNodes, alignment);
        } else if (node.content && node.content[0]?.type === "text") {
          const child = node.content[0];
          const marks = child.marks || [];
          const style = {
            bold: marks.some((m) => m.type === "bold"),
            italic: marks.some((m) => m.type === "italic"),
            fontSize:
              marks.find((m) => m.type === "textStyle")?.attrs?.fontSize || 10,
          };
          renderText(child.text, style, indentLevel * bulletIndent, alignment);
        }
        currentY += blockSpacing;
      } else if (node.type === "heading") {
        const alignment = node.attrs?.textAlign || "left";
        const headingText = node.content?.[0]?.text || "";
        const level = node.attrs.level || 1;
        renderText(
          headingText,
          { bold: true, fontSize: 18 - (level - 1) * 2 },
          indentLevel * bulletIndent,
          alignment
        );
        currentY += blockSpacing;
      } else if (node.type === "bulletList") {
        node.content?.forEach((listItem) => {
          const textNode = listItem.content?.[0]?.content?.[0];
          if (textNode && textNode.type === "text") {
            renderText(
              `• ${textNode.text}`,
              { fontSize: 10 },
              (indentLevel + 1) * bulletIndent,
              "left"
            );
          }
        });
        currentY += blockSpacing;
      } else if (node.type === "codeBlock") {
        // Improved code block support:
        const codeText = node.content
          ? node.content.map((child) => child.text || "").join("\n")
          : "";
        if (codeText.trim() === "") return;
        const maxCodeWidth = pageWidth - margin * 2;
        // Split the code text by newline and wrap each line individually.
        const codeLines = [];
        codeText.split("\n").forEach((line) => {
          const wrapped = doc.splitTextToSize(line, maxCodeWidth);
          codeLines.push(...wrapped);
        });
        doc.setFillColor(230, 230, 230);
        const blockHeight = codeLines.length * lineHeight + 4;
        if (currentY + blockHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.rect(margin, currentY, maxCodeWidth, blockHeight, "F");
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        let codeY = currentY + lineHeight;
        codeLines.forEach((line) => {
          doc.text(line, margin + 2, codeY);
          codeY += lineHeight;
        });
        currentY += blockHeight + blockSpacing;
        doc.setFont("helvetica", "normal");
      }
    };

    traverseContent(content);

    const filename = (fileInfo?.fileName + '.pdf') || "Untitled.pdf";
    doc.save(filename);

    toast('Note saved as PDF!');
  };

  return (
    <div className="control-group py-3 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10">
      {/* Loading indicator */}
      <div
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-black bg-opacity-50 ${isLoadingAnswer ? "visible" : "hidden"}`}
      >
        <Loading classes="dark:bg-zinc-100/0 bg-zinc-100/0" />
      </div>
      <TooltipProvider>
        <div className="button-group flex flex-row flex-wrap justify-center gap-1 sm:gap-2 mb-2 sm:mb-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("heading", { level: 1 })
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                <Heading1Icon width={16} strokeWidth={3} className="sm:w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Heading 1</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("heading", { level: 2 })
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Heading2Icon width={16} strokeWidth={3} className="sm:w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Heading 2</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("heading", { level: 3 })
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <Heading3Icon width={16} strokeWidth={3} className="sm:w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Heading 3</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("bold")
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <BoldIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Bold</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("italic")
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <ItalicIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Italic</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive({ textAlign: "left" })
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <AlignLeftIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Align Left</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive({ textAlign: "center" })
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <AlignCenterIcon
                  width={16}
                  strokeWidth={3}
                  className="sm:w-4"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Align Center</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive({ textAlign: "right" })
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <AlignRightIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Align Right</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("bulletList")
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <ListIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Bullet List</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${
                  editor.isActive("code")
                    ? menuIconActiveClasses
                    : menuIconClasses
                } w-10 h-10 sm:w-auto sm:h-auto`}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >
                <CodeIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>Code</p>
            </TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={addImage} className={menuClasses}>
                <ImageIcon width={16} strokeWidth={3} className="sm:w-4" />
              </button>
            </TooltipTrigger>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${menuClasses} ${menuIconClasses} text-primaryLight dark:text-primaryDark w-10 h-10 sm:w-auto sm:h-auto text`}
                onClick={onAiClick}
              >
                <Sparkles
                  width={16}
                  strokeWidth={3}
                  className="sm:w-4  duration-1000 ease-in-out"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className={toolTipClass}>AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 px-2 cursor-pointer bg-zinc-200 dark:bg-zinc-200/20 rounded-md flex gap-2 items-center">
              <MenuIcon width={16} />
              <span className="text-xs hidden sm:block">Menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 px-1 rounded-lg bg-bgLight dark:bg-bgDark text-black dark:text-white text-sm backdrop:blur-md">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  saveNotes({
                    notes: editor.getHTML(),
                    fileId: fileId,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                  });
                  toast("Saved changes!");
                }}
                className="flex gap-2 items-center hover:bg-zinc-500/10  p-2 rounded-md duration-300"
              >
                <SaveIcon width={16} />
                <span className="text-sm">Save Note</span>
              </button>
              <button
                onClick={onDownloadNote}
                className="flex gap-2 items-center hover:bg-zinc-500/10  p-2 rounded-md duration-300"
              >
                <DownloadIcon width={16} />
                <span className="text-sm">Download Note</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const Editor = ({ fileId }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Dropcursor,
      Image,
      // Placeholder.configure({ placeholder: 'Write something...' }),
    ],
    editorProps: {
      attributes: { class: "focus:outline-none h-full p-5" },
    },
  });

  const notes = useQuery(api.notes.GetNotes, { fileId });
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const menuClasses =
    "flex flex-col items-center justify-center font-bold rounded-md p-1 md:px-2 duration-300";

  const menuIconActiveClasses =
    "is-active bg-zinc-200/20 text-primaryLight dark:text-primaryDark";

  const menuIconClasses = "hover:bg-zinc-300/80 dark:hover:bg-zinc-200/10";

  const toolTipClass =
    "outline outline-1 outline-zinc-300 dark:outline-zinc-700 rounded-sm px-2 py-1 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop:blur-md";

  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [editor, notes]);

  useEffect(() => {
    if (!editor) return;
    let timerId;
    const handleUpdate = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        saveNotes({
          notes: editor.getHTML(),
          fileId,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        });
        toast("Auto-saved changes!");
      }, 2000); // Auto-save after 2 seconds of inactivity
    };
    editor.on("update", handleUpdate);
    return () => {
      clearTimeout(timerId);
      editor.off("update", handleUpdate);
    };
  }, [editor, fileId, user, saveNotes]);

  // Clean up editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <>
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="flex gap-2 bg-zinc-100/95 dark:bg-zinc-800/95 py-1 px-2 rounded-md border border-zinc-500 shadow-lg text-black dark:text-white z-10 backdrop:blur-lg dark:backdrop:blur-lg">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${menuClasses}  ${editor.isActive("bold") ? menuIconActiveClasses : menuIconClasses}`}
            >
              <BoldIcon className="size-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}

              className={`${menuClasses}  ${editor.isActive("italic") ? menuIconActiveClasses : menuIconClasses}`}
            >
              <ItalicIcon className="size-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`${menuClasses}  ${editor.isActive("strike") ? menuIconActiveClasses : menuIconClasses}`}
            >
              <Strikethrough className="size-4" />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* {editor && (
        <FloatingMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="flex gap-2 bg-black/5 p-1 rounded-xl shadow-md text-black/60 z-10">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
            >
              <Heading1Icon className="size-5" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }
            >
              <Heading2Icon className="size-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <ListIcon className="size-5" />
            </button>
          </div>
        </FloatingMenu>
      )} */}

      {/* Wrap MenuBar and EditorContent in a flex column */}
      <div className="flex flex-col h-full mx-auto border-t-2 border-zinc-800 dark:border-zinc-500">
        <div className="bg-bgLight dark:bg-bgDark shadow-md dark:shadow-white/10">
          {editor ? <MenuBar editor={editor} /> : <p>Loading editor...</p>}
        </div>
        <div className="flex-1 overflow-auto shadow-inner">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};

export default Editor;
