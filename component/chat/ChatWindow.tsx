"use client";

import { useRef, useState } from "react";
import { ChatInput } from "@/component/chat/ChatInput";
import { ChatMessageBubble } from "@/component/chat/ChatMessage";
import { ChatMessage } from "@/types/chat";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- Upload handler ----------
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setHasDocument(true);
  };

  // ---------- Chat handler ----------
  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-[calc(100vh-4rem)] bg-white border rounded-lg overflow-hidden">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h2 className="text-sm font-semibold">AskMyDocs</h2>

        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />

          <button
            disabled={hasDocument}
            onClick={() => fileInputRef.current?.click()}
            className={`text-sm px-3 py-1.5 rounded-md border
              ${
                hasDocument
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-muted"
              }`}
          >
            {hasDocument ? "Document uploaded ✓" : "Upload document"}
          </button>
        </>
      </div>

      {/* ---------- Chat Area ---------- */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Upload a document and start asking questions.
          </p>
        )}

        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* ---------- Input ---------- */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}