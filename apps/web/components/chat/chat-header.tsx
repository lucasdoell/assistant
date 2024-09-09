import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { PlusCircle } from "lucide-react";
import openai from "./openai-logomark.png";

export function ChatHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background h-20">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={openai.src} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Personal Assistant</h2>
          <p className="text-sm text-muted-foreground">OpenAI GPT-4o</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <PlusCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
