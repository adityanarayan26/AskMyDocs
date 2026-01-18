
"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!content.trim() || isLoading) return;
      onSend(content);
      setContent("");
    }
  };

  return (
    <div className="relative group">
      {/* Removed colored gradient, added subtle white glow */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" />

      <div className="relative flex items-end p-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all focus-within:ring-1 focus-within:ring-white/20">

        <textarea
          className="flex-1 max-h-48 min-h-[50px] w-full bg-transparent border-0 resize-none px-4 py-3 text-white placeholder-gray-500 focus:ring-0 text-sm sm:text-base scrollbar-hide focus:outline-none"
          placeholder="Ask a question about your documents..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          onClick={() => {
            if (!content.trim() || isLoading) return;
            onSend(content);
            setContent("");
          }}
          disabled={!content.trim() || isLoading}
          className="p-3 bg-white hover:bg-gray-200 text-black rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 ml-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center mt-2">
        <p className="text-[10px] text-gray-600">
          askmydocs can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}