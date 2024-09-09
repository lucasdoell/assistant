import { cn } from "@ui/lib/utils";
import type { Message } from "ai";

export function Message({ message }: { message: Message }) {
  return (
    <>
      <div
        className={cn(
          "flex whitespace-pre-wrap",
          message.role === "user" ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl p-3 max-w-[70%] relative",
            message.role === "user"
              ? "bg-primary message-tail-right"
              : "bg-accent message-tail-left",
          )}
        >
          <p
            className={cn(
              "text-sm",
              message.role === "user"
                ? "text-primary-foreground"
                : "text-foreground",
            )}
          >
            {message.content}
          </p>
          <p
            className={cn(
              "text-xs mt-1 opacity-70",
              message.role === "user"
                ? "text-primary-foreground"
                : "text-foreground",
            )}
          >
            {message.createdAt?.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </>
  );
}
