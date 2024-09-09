import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { ChevronDown } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-80 bg-background border-r border-border">
      <div className="p-4 border-b border-border h-20">
        <Button variant="outline" className="w-full justify-between">
          All Chats
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        {[
          { name: "Alice Smith", date: "Today", message: "Hey, how are you?" },
          {
            name: "Bob Johnson",
            date: "Yesterday",
            message: "Did you see the game last night?",
          },
          {
            name: "Charlie Brown",
            date: "Mon",
            message: "Let's meet up this weekend",
          },
          {
            name: "Diana Prince",
            date: "Sun",
            message: "Thanks for your help!",
          },
          { name: "Ethan Hunt", date: "Sat", message: "Mission accomplished" },
        ].map((chat, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 hover:bg-foreground/10 cursor-pointer border-b border-border"
          >
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/100?img=${index}`} />
              <AvatarFallback>
                {chat.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                {chat.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {chat.date} &bull; {chat.message}
              </p>
            </div>
            <div className="text-xs text-muted-foreground"></div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
