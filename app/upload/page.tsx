"use client";

import { UploadDropzone } from "@/component/upload/UploadDropzone";

export default function UploadPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl rounded-xl border p-8 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">
          Upload a document
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Upload a PDF or DOCX. One file at a time.
        </p>

        <UploadDropzone />
      </div>
    </div>
  );
}