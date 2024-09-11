import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Paperclip, Send } from "lucide-react";

export function ChatInput({
  handleSubmit,
  handleInputChange,
  input,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="absolute bottom-4 left-4 right-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 bg-background rounded-full shadow-lg p-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-6 w-6" />
          </Button>
          <Input
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
          />
          <Button size="icon" className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
