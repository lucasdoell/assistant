"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/message";
import { ScrollArea } from "@ui/scroll-area";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: "http://localhost:8080/v1/chat",
  });

  return (
    <>
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 pb-20 max-w-4xl mx-auto">
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
      </ScrollArea>

      {/* Floating Message Input */}
      <ChatInput
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        input={input}
      />
    </>
  );
}
