import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { Message, convertToCoreMessages, generateText } from "ai";

export async function saveChat(
  messages: Message[],
  text: string,
  chatId: string,
  userId: string,
) {
  const chat = [
    ...messages,
    { role: "assistant", content: text, createdAt: new Date() },
  ];

  console.log("Saving chat...");

  const existingChat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  try {
    if (existingChat) {
      await prisma.chat.update({
        where: { id: chatId },
        data: { messages: JSON.stringify(chat) },
      });
    } else {
      const { text: title } = await generateText({
        model: openai("gpt-4o-mini"),
        system:
          "Summarize the conversation so far in a few words to give the chat a title. Return only plain text. Do not use markdown.",
        messages: convertToCoreMessages(chat as Message[]),
      });

      await prisma.chat.create({
        data: {
          id: chatId,
          title,
          userId,
          messages: JSON.stringify(chat),
        },
      });
    }
  } catch (error) {
    console.error("Error saving chat:", error);
    return;
  }

  console.log("Chat saved successfully");
}
