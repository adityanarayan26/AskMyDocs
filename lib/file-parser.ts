import mammoth from "mammoth";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

export async function parseFile(file: File): Promise<string> {
  // DOCX
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // PDF (LangChain loader)
  if (file.type === "application/pdf") {
    const buffer = Buffer.from(await file.arrayBuffer());

    const tempPath = path.join(
      os.tmpdir(),
      `${crypto.randomUUID()}.pdf`
    );

    await writeFile(tempPath, buffer);

    const loader = new PDFLoader(tempPath);
    const docs = await loader.load();

    await unlink(tempPath);

    return docs.map((d) => d.pageContent).join("\n");
  }

  throw new Error("Unsupported file type");
}