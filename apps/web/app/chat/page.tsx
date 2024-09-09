import { Chat } from "@/components/chat/chat";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return <Chat />;
}
