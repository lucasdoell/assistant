// app/chat/layout.tsx

import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-primary-foreground">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">{children}</div>
    </div>
  );
}
