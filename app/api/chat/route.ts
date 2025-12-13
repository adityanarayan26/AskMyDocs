import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { langfuse } from "@/lib/langfuse";
import { getAvailableDocuments } from "@/lib/tools/getDocuments";
import { searchKnowledgeBase } from "@/lib/tools/searchPinecone";
import { ChatMessage } from "@/types/chat";

export const runtime = "nodejs";

// Groq chat model (stable + supported)
const chatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.1-8b-instant",
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content.toLowerCase();

    // ---------- LANGFUSE TRACE ----------
    const trace = langfuse.trace({
      name: "chat-request",
      input: lastMessage.content,
    });

    // ---------- LIST DOCUMENTS ----------
    if (
      userContent.includes("what documents") ||
      userContent.includes("list documents")
    ) {
      const docsSpan = trace.span({ name: "get-documents" });

      const docs = await getAvailableDocuments();
      const docList = docs.map((d) => `- ${d.fileName}`).join("\n");

      docsSpan.end({ output: { count: docs.length } });

      const response = await chatModel.invoke([
        new SystemMessage("You are a helpful assistant."),
        new HumanMessage(`These documents are available:\n\n${docList}`),
      ]);

      trace.update({ output: response.text });

      return NextResponse.json({ reply: response.text });
    }

    // ---------- PINECONE SEARCH ----------
    const searchSpan = trace.span({
      name: "pinecone-search",
      input: lastMessage.content,
    });

    const chunks = await searchKnowledgeBase(lastMessage.content);

    searchSpan.end({
      output: { chunksFound: chunks.length },
    });

    // ---------- FALLBACK: NORMAL CHAT ----------
    if (chunks.length === 0) {
      const response = await chatModel.invoke([
        new SystemMessage("You are a helpful assistant."),
        new HumanMessage(lastMessage.content),
      ]);

      trace.update({ output: response.text });

      return NextResponse.json({ reply: response.text });
    }

    // ---------- RAG ANSWER ----------
    const context = chunks
      .map((c, i) => `[${i + 1}] (${c.fileName}) ${c.content}`)
      .join("\n");

    const generationSpan = trace.span({ name: "llm-generation" });

    const response = await chatModel.invoke([
      new SystemMessage(
        `Answer the question using ONLY the context below.\n\n${context}`
      ),
      new HumanMessage(lastMessage.content),
    ]);

    generationSpan.end({ output: response.text });

    const sources = [...new Set(chunks.map((c) => c.fileName))];

    trace.update({ output: response.text });

    return NextResponse.json({
      reply: `${response.text}\n\nSources:\n${sources.join(", ")}`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}