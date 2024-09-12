// app/chat/layout.tsx

import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";
import type { Chat } from "@repo/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await auth();
  if (!user) redirect("/login");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/chat`, {
    credentials: "include",
    headers: { Cookie: cookies().toString() },
  });

  const chats: Chat[] = await response.json();

  return (
    <div className="flex h-screen bg-primary-foreground">
      {/* Left Sidebar */}
      <Sidebar chats={chats} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">{children}</div>
    </div>
  );
}
