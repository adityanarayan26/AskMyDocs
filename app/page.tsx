
"use client";

import { ChatWindow } from "@/component/chat/ChatWindow";
import { Sidebar } from "@/component/sidebar/Sidebar";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full">
        {/* Top Bar for Mobile could go here */}
        <ChatWindow />
      </main>
    </div>
  );
}