import { Button } from "@ui/button";
import { cn } from "@ui/lib/utils";
import { Skeleton } from "@ui/skeleton";

export function MessageSkeleton({ role }: { role: "user" | "assistant" }) {
  return (
    <>
      <div
        className={cn(
          "flex whitespace-pre-wrap py-2",
          role === "user" ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl p-3 max-w-[70%] relative group",
            role === "user"
              ? "bg-primary message-tail-right"
              : "bg-accent message-tail-left",
          )}
        >
          <Skeleton className="h-20 w-[400px]" />
          <p className="text-xs mt-1 opacity-70">
            <Skeleton className="h-4 w-12" />
          </p>
        </div>
      </div>
    </>
  );
}

export function ChatInputSkeleton() {
  return (
    <div className="absolute bottom-4 left-4 right-4 max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 bg-background rounded-full shadow-lg p-2">
        <Button variant="ghost" size="icon" className="rounded-full" disabled>
          <Skeleton className="h-6 w-6" />
        </Button>
        <Skeleton className="h-6 w-full flex-1" />
        <Button size="icon" className="rounded-full" disabled>
          <Skeleton className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
