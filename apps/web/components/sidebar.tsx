"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chat } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { toast } from "@ui/hooks/use-toast";
import { Input } from "@ui/input";
import { cn } from "@ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { ScrollArea } from "@ui/scroll-area";
import { Skeleton } from "@ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { ChevronDown, Ellipsis, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type GroupName = "Today" | "Yesterday" | "Past Week" | "Earlier";
type GroupedChats = Partial<Record<GroupName, Chat[]>>;

function getGroupName(date: Date): GroupName {
  const today = new Date();
  const chatDate = new Date(date);

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 7);

  if (chatDate >= startOfToday) {
    return "Today";
  } else if (chatDate >= startOfYesterday) {
    return "Yesterday";
  } else if (chatDate >= startOfWeek) {
    return "Past Week";
  } else {
    return "Earlier";
  }
}

export function Sidebar() {
  const pathname = usePathname();

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/chat`,
        {
          credentials: "include",
        },
      );

      return (await response.json()) as Chat[];
    },
    staleTime: Infinity,
  });

  const groupedChats: GroupedChats = useMemo(() => {
    if (!chats) return {};

    return chats.reduce<GroupedChats>((groups, chat) => {
      const groupName = getGroupName(chat.updatedAt);
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName]!.push(chat); // The '!' asserts that groups[groupName] is not undefined
      return groups;
    }, {});
  }, [chats]);

  return (
    <div className="w-80 bg-background border-r border-border">
      <div className="p-4 border-b border-border h-20">
        <Button variant="outline" className="w-full justify-between">
          All Chats
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div
          className={cn(
            "flex items-center p-4 hover:bg-foreground/10 cursor-pointer border-b border-border",
          )}
        >
          <div className="flex-grow min-w-0">
            <Link href="/chat" key="new-chat">
              <span className="inline-flex align-middle items-center text-sm font-medium text-secondary-foreground">
                <PlusCircle className="h-4 w-4 mr-2" /> New Chat
              </span>
            </Link>
          </div>
        </div>

        {isLoading && (
          <>
            {[0, 1, 2, 3, 4, 5, 7, 8, 9].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex items-center p-4 hover:bg-foreground/10 cursor-pointer border-b border-border"
              >
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </>
        )}

        {groupedChats &&
          Object.entries(groupedChats).map(([group, chats]) => (
            <div key={group}>
              {/* Group Header */}
              <div className="px-4 py-4 text-xs font-semibold text-muted-foreground">
                {group}
              </div>

              {/* Chats within the Group */}
              {chats
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime(),
                )
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center px-4 py-2 hover:bg-foreground/10 cursor-pointer",
                      pathname === `/chat/${chat.id}` && "bg-foreground/10",
                    )}
                  >
                    <div className="flex-grow min-w-0">
                      <Link href={`/chat/${chat.id}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-sm font-medium text-secondary-foreground truncate text-ellipsis max-w-[200px]">
                              {chat.title}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{chat.title}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-sm text-muted-foreground">
                              {new Date(chat.updatedAt).toDateString()}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Last updated at{" "}
                              {new Date(chat.updatedAt).toLocaleString()}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Link>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost" className="ml-auto">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        <div className="flex flex-col gap-1 space-y-2">
                          <RenameChat id={chat.id} title={chat.title} />
                          <DeleteChat id={chat.id} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}

function RenameChat({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(1).max(60),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/chat/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ title: values.title }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (res.ok) {
      toast({
        title: "Chat renamed successfully",
        description: "Chat renamed successfully",
        duration: 5000,
      });
      router.refresh();
    } else {
      toast({
        title: "Failed to rename chat",
        description: "Failed to rename chat",
        duration: 5000,
      });
    }
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Rename</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your chat. It will be displayed in the
                    sidebar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Renaming..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteChat({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/chat/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (res.ok) {
      toast({
        title: "Chat deleted successfully",
        description: "Chat deleted successfully",
        duration: 5000,
      });
      router.push("/chat");
    } else {
      toast({
        title: "Failed to delete chat",
        description: "Failed to delete chat",
        duration: 5000,
      });
    }
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </p>
          <div className="flex justify-end">
            <Button variant="destructive" onClick={onSubmit} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
}
