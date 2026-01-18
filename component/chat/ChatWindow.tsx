
"use client";

import { useState } from "react";
import { ChatInput } from "@/component/chat/ChatInput";
import { ChatMessageBubble } from "@/component/chat/ChatMessage";
import { ChatMessage } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col w-full h-full relative bg-black">

      {/* ---------- Messages Area ---------- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="p-6">
                {/* Replaced Bot Icon with Logo Image */}
                <div className="mx-auto mb-4 w-24 flex justify-center">
                  <Image
                    src="/logo.svg"
                    alt="askmydocs"
                    width={120}
                    height={120}
                    className="w-24 h-auto"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you?</h2>
                <p className="text-gray-400 max-w-sm">
                  I can analyze your documents, summarize content, and answer specific questions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                {[
                  "Summarize the key points",
                  "Find specific dates and deadlines",
                  "Explain technical terms",
                  "Compare two documents"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-left text-sm text-gray-300 hover:text-white group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-white transition-opacity" />
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 ml-4"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </motion.div>
        )}
      </div>

      {/* ---------- Input Area ---------- */}
      <div className="p-4 md:p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}