import { openai } from "@ai-sdk/openai";
import {
  StreamData,
  convertToCoreMessages,
  streamText,
  streamToResponse,
} from "ai";
import { Request, Response } from "express";

export async function chatController(req: Request, res: Response) {
  const { messages } = await req.body;

  console.log(messages);

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    // prompt: "What is the weather in San Francisco?",
    messages: convertToCoreMessages(messages),
  });

  const data = new StreamData();

  data.append("initialized call");

  streamToResponse(
    result.toAIStream({
      onFinal() {
        data.append("call completed");
        data.close();
      },
    }),
    res,
    {},
    data,
  );
}
