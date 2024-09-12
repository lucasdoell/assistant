"use client";

import { Chat } from "@repo/db";
import { Button } from "@ui/button";
import { cn } from "@ui/lib/utils";
import { ScrollArea } from "@ui/scroll-area";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ chats }: { chats: Chat[] }) {
  const pathname = usePathname();

  return (
    <div className="w-80 bg-background border-r border-border">
      <div className="p-4 border-b border-border h-20">
        <Button variant="outline" className="w-full justify-between">
          All Chats
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        {chats
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .map((chat, index) => (
            <Link href={`/chat/${chat.id}`} key={index}>
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-4 p-4 hover:bg-foreground/10 cursor-pointer border-b border-border",
                  pathname === `/chat/${chat.id}` && "bg-foreground/10",
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {chat.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {new Date(chat.updatedAt).toDateString()}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground"></div>
              </div>
            </Link>
          ))}
      </ScrollArea>
    </div>
  );
}
