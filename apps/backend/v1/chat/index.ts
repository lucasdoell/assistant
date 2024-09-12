import { lucia } from "@/lib/auth";
import { Context } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { saveChat } from "@/v1/chat/save-chat";
import { openai } from "@ai-sdk/openai";
import { Message, StreamData, convertToCoreMessages, streamText } from "ai";
import { Hono } from "hono";
import { streamText as honoStream } from "hono/streaming";

export const chatRouter = new Hono<Context>().basePath("/v1/chat");

chatRouter.post("/", async (c) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) return c.json({ message: "User not found" }, 404);
  const { user } = await lucia.validateSession(sessionId);

  const userId = user?.id;
  if (!userId) return c.json({ message: "User not found" }, 404);

  const { messages, id } = await c.req.json<{
    messages: Message[];
    id: string;
  }>();

  return honoStream(
    c,
    async (stream) => {
      const data = new StreamData();

      const result = await streamText({
        model: openai("gpt-4o-2024-08-06"),
        messages: convertToCoreMessages(messages),
        onFinish({ text }) {
          data.close();
          saveChat(messages, text, id, userId);
        },
      });

      const responseStream = result.toDataStreamResponse({ data });

      // Create a reader to read the response stream
      const reader = responseStream.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response stream.");
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await stream.write(value);
        }
      } catch (error) {
        console.error("Error in streaming:", error);
      } finally {
        reader.releaseLock();
      }
    },
    async (err, stream) => {
      stream.writeln("An error occurred!");
      console.error(err);
    },
  );
});

// Retrieve chats from DB
chatRouter.get("/", async (c) => {
  const session = c.get("session");
  if (!session) return c.json({ message: "User not found" }, 404);

  const userId = session.userId;

  const chats = await prisma.chat.findMany({
    where: { userId },
  });

  return c.json(chats);
});

// Retrieve chat from DB
chatRouter.get("/:chat", async (c) => {
  const session = c.get("session");
  if (!session) return c.json({ message: "User not found" }, 404);

  const chatId = c.req.param("chat");
  if (!chatId) return c.json({ message: "Chat not found" }, 404);

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { messages: true },
  });

  if (!chat) return c.json({ message: "Chat not found" }, 404);

  return c.json(chat);
});

chatRouter.patch("/:chat", async (c) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) return c.json({ message: "User not found" }, 404);

  const { user } = await lucia.validateSession(sessionId);
  if (!user) return c.json({ message: "User not found" }, 404);

  const chatId = c.req.param("chat");
  if (!chatId) return c.json({ message: "Chat not found" }, 404);

  const { title } = await c.req.json<{ title: string }>();

  if (!title || title.length < 1 || title.length > 60) {
    return c.json({ message: "Invalid title" }, 400);
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });
  if (!chat) return c.json({ message: "Chat not found" }, 404);

  if (chat.userId !== user.id) return c.json({ message: "Forbidden" }, 403);

  await prisma.chat.update({
    where: { id: chatId },
    data: { title },
  });

  return c.json(chat);
});

chatRouter.delete("/:chat", async (c) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) return c.json({ message: "User not found" }, 404);

  const { user } = await lucia.validateSession(sessionId);
  if (!user) return c.json({ message: "User not found" }, 404);

  const chatId = c.req.param("chat");
  if (!chatId) return c.json({ message: "Chat not found" }, 404);

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { userId: true },
  });

  if (!chat) return c.json({ message: "Chat not found" }, 404);

  if (chat.userId !== user.id) return c.json({ message: "Forbidden" }, 403);

  await prisma.chat.delete({
    where: { id: chatId },
  });

  return c.json({ message: "Chat deleted successfully" }, 200);
});
