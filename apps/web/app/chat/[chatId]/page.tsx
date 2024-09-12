import { Chat } from "@/components/chat/chat";
import { auth } from "@/lib/auth";
import { Message } from "ai";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Chat = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  updatedAt: string;
};

type ChatResponse =
  | {
      type: "success";
      id: string;
      messages: string;
      createdAt: string;
      updatedAt: string;
    }
  | {
      type: "error";
      message: string;
    };

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const user = await auth();
  if (!user) redirect("/login");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/chat/${params.chatId}`,
    {
      credentials: "include",
      headers: { Cookie: cookies().toString() },
    },
  );

  const chat: ChatResponse = await response.json();
  if ("message" in chat) redirect("/chat");

  const messages: Chat[] = JSON.parse(chat.messages);

  const parsedMsgs = messages.map((m): Message => {
    return { ...m, createdAt: new Date(m.createdAt) };
  });

  return <Chat existingMessages={parsedMsgs} chatId={params.chatId} />;
}
