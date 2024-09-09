import { Button } from "@ui/button";
import { toast } from "@ui/hooks/use-toast";
import { cn } from "@ui/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import type { Message } from "ai";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const MarkdownComponents: Components = {
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");

    return match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...(props as any)}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export function Message({ message }: { message: Message }) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {},
  );

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
        duration: 5000,
      });
      setCopiedStates((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex whitespace-pre-wrap py-2",
          message.role === "user" ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl p-3 max-w-[70%] relative group",
            message.role === "user"
              ? "bg-primary message-tail-right"
              : "bg-accent message-tail-left",
          )}
        >
          <ReactMarkdown
            className={cn(
              "text-sm markdown-content",
              message.role === "user"
                ? "text-primary-foreground"
                : "text-foreground",
            )}
            components={MarkdownComponents}
          >
            {message.content}
          </ReactMarkdown>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-foreground`}
                onClick={() => copyToClipboard(message.content, message.id)}
              >
                {copiedStates[message.id] ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {copiedStates[message.id] ? "Copied!" : "Copy to clipboard"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
