import { Chat } from "@/components/chat/chat";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const chat = await response.json();
  if (chat === null) redirect("/chat");

  const messages = JSON.parse(chat.messages);

  const parsedMsgs = messages.map((m: any) => {
    return { ...m, createdAt: new Date(m.createdAt) };
  });

  return <Chat existingMessages={parsedMsgs} chatId={params.chatId} />;
}
