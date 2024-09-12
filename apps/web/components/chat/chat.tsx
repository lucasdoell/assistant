"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/message";
import { generateChatId } from "@/lib/chat";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@ui/scroll-area";
import type { Message as ChatMessage } from "ai";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

export function Chat({
  existingMessages,
  chatId,
  newChat,
  chatTitle,
}: {
  existingMessages?: ChatMessage[];
  chatId?: string;
  newChat?: boolean;
  chatTitle?: string;
}) {
  const router = useRouter();
  const id = newChat ? generateChatId() : chatId;
  const queryClient = useQueryClient();

  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: `http://localhost:8080/v1/chat`,
    initialMessages: existingMessages ?? [],
    credentials: "include",
    body: { id },
    onFinish() {
      router.push(`/chat/${id}`);
    },
    sendExtraMessageFields: true,
  });

  if (!newChat) {
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  }

  return (
    <>
      {/* Chat Header */}
      <ChatHeader chatTitle={chatTitle} />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 pb-20">
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
