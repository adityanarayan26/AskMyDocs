import React from "react";
import { FileText } from "lucide-react";

type DocumentItem = {
  id: string;
  fileName: string;
  createdAt?: string;
};

type DocumentsListProps = {
  documents: DocumentItem[];
};

const DocumentsList = ({ documents }: DocumentsListProps) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((file) => (
        <div
          key={file.id}
          className="border rounded-lg p-3 flex items-center gap-3 bg-white"
        >
          <FileText size={16} className="text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{file.fileName}</span>
            {file.createdAt && (
              <span className="text-xs text-muted-foreground">
                Uploaded {new Date(file.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsList;
