import { Context } from "@/lib/context";
import { openai } from "@ai-sdk/openai";
import { Message, convertToCoreMessages, streamText } from "ai";
import { Hono } from "hono";
import { streamText as honoStream } from "hono/streaming";

export const chatRouter = new Hono<Context>().basePath("/v1/chat");

chatRouter.post("/", async (c) => {
  const { messages } = await c.req.json<{ messages: Message[] }>();

  return honoStream(
    c,
    async (stream) => {
      const result = await streamText({
        model: openai("gpt-4-turbo"),
        messages: convertToCoreMessages(messages),
      });

      // Convert ReadableStream to async iterable
      const reader = result.toAIStream().getReader();

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
      // Error handling should be async and return a Promise
      stream.writeln("An error occurred!");
      console.error(err);
    },
  );
});
