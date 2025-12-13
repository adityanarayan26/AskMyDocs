"use client";

import { useState } from "react";

export function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText("");
      }}
      className="mt-4 flex gap-2"
    >
      <input
        className="flex-1 rounded-md border px-3 py-2 text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask something…"
      />
      <button
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}