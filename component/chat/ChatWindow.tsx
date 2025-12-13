"use client";

import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessage";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });

    const data = await res.json();

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: data.reply,
    };

    setMessages((m) => [...m, assistantMsg]);
    setLoading(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col p-4">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((m) => (
          <ChatMessageBubble key={m.id} message={m} />
        ))}
        {loading && <p className="text-sm text-muted-foreground">Thinking…</p>}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}