import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInputSkeleton, MessageSkeleton } from "@/components/chat/skeleton";
import { ScrollArea } from "@ui/scroll-area";

export default function Loading() {
  return (
    <main>
      <ChatHeader />

      <ScrollArea className="flex-1 p-4 pb-20">
        {[0, 1, 2, 3, 4].map((m, index) => (
          <MessageSkeleton
            key={index}
            role={index % 2 === 0 ? "user" : "assistant"}
          />
        ))}
      </ScrollArea>

      <ChatInputSkeleton />
    </main>
  );
}
