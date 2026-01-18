
"use client";

import { ChatMessage } from "@/types/chat";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import Image from "next/image";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {/* Avatar */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-lg overflow-hidden ${isUser
            ? "bg-white border-white text-black"
            : "bg-black border-white/10 text-white"
          }`}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Image
              src="/logo.svg"
              alt="AI"
              width={24}
              height={24}
              className="w-full h-full object-contain p-1"
            />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`relative p-4 md:p-5 rounded-2xl shadow-lg text-sm md:text-base leading-relaxed ${isUser
              ? "bg-white text-black rounded-tr-sm"
              : "bg-zinc-900 border border-white/10 backdrop-blur-md text-gray-100 rounded-tl-sm"
            }`}
        >
          {/* Markdown Content */}
          <div className="markdown-content space-y-2">
            <ReactMarkdown
              components={{
                ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />, // Inherit color
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                code: ({ node, ...props }) => <code className="bg-gray-800/30 px-1 py-0.5 rounded text-xs font-mono" {...props} />
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}