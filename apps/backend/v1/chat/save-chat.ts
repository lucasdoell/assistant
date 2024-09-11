import { prisma } from "@/lib/prisma";
import { CoreMessage } from "ai";

export async function saveChat(
  messages: CoreMessage[],
  text: string,
  chatId: string,
  userId: string,
) {
  const chat = [...messages, { role: "assistant", content: text }];

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
      await prisma.chat.create({
        data: {
          id: chatId,
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
