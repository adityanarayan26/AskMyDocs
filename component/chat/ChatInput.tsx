"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSend: (text: string) => void;
  isLoading?: boolean;
};

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t bg-white p-4"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask a question about your documents…"
        disabled={isLoading}
        className="flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        {isLoading ? "Thinking…" : <Send size={14} />}
      </button>
    </form>
  );
}