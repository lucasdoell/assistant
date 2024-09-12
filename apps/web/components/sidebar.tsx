"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chat } from "@repo/db";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { ChevronDown, Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
            <div
              key={index}
              className={cn(
                "flex items-center p-4 hover:bg-foreground/10 cursor-pointer border-b border-border",
                pathname === `/chat/${chat.id}` && "bg-foreground/10",
              )}
            >
              <div className="flex-grow min-w-0">
                <Link href={`/chat/${chat.id}`} key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm font-medium text-primary truncate text-ellipsis max-w-[200px]">
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
