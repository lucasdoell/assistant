"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/message";
import { ScrollArea } from "@ui/scroll-area";
import type { Message as ChatMessage } from "ai";
import { useChat } from "ai/react";
import { useEffect } from "react";

export function Chat({
  existingMessages,
  chatId,
}: {
  existingMessages?: ChatMessage[];
  chatId?: string;
}) {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: `http://localhost:8080/v1/chat${existingMessages ? "/" + chatId : ""}`,
    initialMessages: existingMessages ?? [],
    credentials: "include",
  });

  useEffect(() => {
    if (data && data[0] && !existingMessages) {
      const { chatId } = data[0] as { chatId: string };
      window.location.href = `/chat/${chatId}`;
    }
  }, [data]);

  return (
    <>
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 pb-20 2xl:max-w-4xl 2xl:mx-auto">
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

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
