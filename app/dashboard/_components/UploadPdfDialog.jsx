"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAction, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

const UploadPdfDialog = ({ children, isMaxFile }) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const AddFileEntry = useMutation(api.fileStorage.AddFileEntry);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myActions.ingest);
  const saveNotes = useMutation(api.notes.AddNotes);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const OnUpload = async () => {
    setLoading(true);

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId = uuidv4();
    const fileUrl = await getFileUrl({
      storageId: storageId,
    });

    const resp = await AddFileEntry({
      fileId: fileId,
      storageId: storageId,
      fileName: fileName ?? "Untitled",
      fileUrl: fileUrl,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

    const apiResp = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`);

    const embeddedResp = await embeddDocument({
      splitText: apiResp.data.result,
      fileId: fileId,
    });

    saveNotes({
      notes: "<p>Start writing your note!!<p>",
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

    setLoading(false);
    setOpen(false);
    toast("File Uploaded!");
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTrigger asChild className="flex items-center justify-star">
          <Button
            onClick={() => setOpen(true)}
            disabled={isMaxFile}
            className=" py-2 px-[52px] font-semibold rounded-lg bg-primaryLight dark:bg-primaryDark text-white dark:text-zinc-900 transition-all shadow-[3px_3px_0px_black] dark:shadow-[3px_3px_0px_white] dark:hover:shadow-none hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] "
          >
            + Upload PDF
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>

            <DialogDescription asChild>
              <div>
                <div className="flex gap-2 mt-2 p-3 rounded-md ">
                  <h2>Select File to Upload</h2>
                  <input
                    type="file"
                    accept="application/pdf"
                    name=""
                    id=""
                    onChange={(event) => OnFileSelect(event)}
                  />
                </div>
                <div className="mt-2">
                  <label>File Name *</label>
                  <Input
                    placeholder="File Name"
                    onChange={(event) => setFileName(event.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </DialogClose>

            <Button onClick={OnUpload}>
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadPdfDialog;
