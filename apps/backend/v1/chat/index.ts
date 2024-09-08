import { Context } from "@/lib/context";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { Hono } from "hono";
import { streamText as honoStream } from "hono/streaming";

export const chatRouter = new Hono<Context>().basePath("/v1/chat");

chatRouter.post("/", async (c) => {
  const { messages } = await c.req.json<{ messages: CoreMessage[] }>();

  return honoStream(
    c,
    async (stream) => {
      const result = await streamText({
        model: openai("gpt-4-turbo"),
        messages: messages,
      });

      const responseStream = result.toDataStreamResponse();

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
