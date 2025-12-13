import { ChatMessage } from "@/types/chat";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
        isUser
          ? "ml-auto bg-primary text-primary-foreground"
          : "mr-auto bg-muted"
      }`}
    >
      {message.content}
    </div>
  );
}