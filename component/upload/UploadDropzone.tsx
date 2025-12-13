"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export function UploadDropzone() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    if (files.length !== 1) {
      setError("Upload exactly one file.");
      return;
    }

    const file = files[0];
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setError("Upload failed.");
    }

    setUploading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer rounded-lg border border-dashed p-10 text-center hover:bg-muted"
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p>Uploading…</p>
      ) : (
        <p>Drag & drop a PDF or DOCX here</p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}