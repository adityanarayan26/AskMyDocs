"use client";

import { ChatMessage } from "@/types/chat";

type ChatMessageBubbleProps = {
  message: ChatMessage;
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed
        ${isUser ? "bg-black text-white" : "bg-muted text-foreground"}`}
      >
        {message.content}
      </div>
    </div>
  );
}