import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function chunkText(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
  });

  return splitter.splitText(text);
}