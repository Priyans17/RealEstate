import prisma from "../lib/prisma.js";
import { retryOperation } from "../lib/retry.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // Use retry mechanism for chat update
    await retryOperation(async () => {
      return prisma.chat.update({
        where: { id: chatId },
        data: {
          lastMessage: text,
          seenBy: { set: [tokenUserId] }
        }
      });
    });

    // Serialize BigInt fields if any
    const serializedMessage = {
      ...message,
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      userId: message.userId.toString(),
      createdAt: message.createdAt.toISOString()
    };
    
    res.status(200).json(serializedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
