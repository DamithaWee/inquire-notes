import React from "react";

const PdfViewer = ({ fileUrl }) => {
  return (
    <div className="h-full border-t-2 border-zinc-800 dark:border-zinc-500">
      <iframe
        src={`${fileUrl}#toolbar=0`}
        width="100%"
        height="100%"
        className="h-full"
      />
    </div>
  );
};

export default PdfViewer;
