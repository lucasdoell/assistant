import { lucia } from "@/lib/auth";
import { generateChatId } from "@/lib/chat";
import { Context } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { saveChat } from "@/v1/chat/save-chat";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, StreamData, streamText } from "ai";
import { Hono } from "hono";
import { streamText as honoStream } from "hono/streaming";

export const chatRouter = new Hono<Context>().basePath("/v1/chat");

// New chat
chatRouter.post("/", async (c) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) return c.json({ message: "User not found" }, 404);
  const { user } = await lucia.validateSession(sessionId);

  const userId = user?.id;
  if (!userId) return c.json({ message: "User not found" }, 404);

  const { messages } = await c.req.json<{ messages: CoreMessage[] }>();

  return honoStream(
    c,
    async (stream) => {
      const data = new StreamData();

      const result = await streamText({
        model: openai("gpt-4o-2024-08-06"),
        messages,
        onFinish({ text }) {
          const chatId = generateChatId();

          data.append({ chatId });
          data.close();
          saveChat(messages, text, chatId, userId);
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

// Existing chat
chatRouter.post("/:chat", async (c) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  const { user } = await lucia.validateSession(sessionId!);

  const userId = user?.id;
  if (!userId) return c.json({ message: "User not found" }, 404);

  const chatId = c.req.param("chat");
  if (!chatId) return c.json({ message: "Chat not found" }, 404);

  const { messages } = await c.req.json<{ messages: CoreMessage[] }>();

  return honoStream(
    c,
    async (stream) => {
      const data = new StreamData();
      data.append("initialized call");

      const result = await streamText({
        model: openai("gpt-4o-2024-08-06"),
        messages,
        onFinish({ text }) {
          data.append("call completed");
          data.close();
          saveChat(messages, text, chatId, userId);
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
