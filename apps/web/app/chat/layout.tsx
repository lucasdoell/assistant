// app/chat/layout.tsx

import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await auth();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-primary-foreground">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">{children}</div>
    </div>
  );
}
