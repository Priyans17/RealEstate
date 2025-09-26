import prisma from "../lib/prisma.js";
import { retryOperation } from "../lib/retry.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      // Skip if receiverId is undefined or invalid
      if (!receiverId) {
        console.log("Invalid receiverId found in chat:", chat.id);
        continue;
      }

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      
      // Only add receiver if user exists
      if (receiver) {
        chat.receiver = receiver;
      } else {
        console.log("Receiver not found for ID:", receiverId);
        // Set a default receiver or skip this chat
        chat.receiver = {
          id: receiverId,
          username: "Unknown User",
          avatar: "/noavatar.jpg"
        };
      }
    }

    // Filter out chats with invalid data and serialize BigInt fields
    const validChats = chats.filter(chat => 
      chat.receiver && 
      chat.userIDs && 
      chat.userIDs.length === 2 && 
      chat.userIDs.every(id => id && id !== undefined)
    );
    
    const serializedChats = validChats.map(chat => ({
      ...chat,
      id: chat.id.toString(),
      userIDs: chat.userIDs.map(id => id.toString()),
      seenBy: chat.seenBy.map(id => id.toString())
    }));
    
    res.status(200).json(serializedChats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await retryOperation(async () => {
      return prisma.chat.update({
        where: { id: req.params.id },
        data: { seenBy: { set: [tokenUserId] } }
      });
    });

    // Serialize BigInt fields if any
    const serializedChat = {
      ...chat,
      id: chat.id.toString(),
      userIDs: chat.userIDs.map(id => id.toString()),
      seenBy: chat.seenBy.map(id => id.toString()),
      messages: chat.messages.map(message => ({
        ...message,
        id: message.id.toString(),
        chatId: message.chatId.toString(),
        userId: message.userId.toString(),
        createdAt: message.createdAt.toISOString()
      }))
    };
    
    res.status(200).json(serializedChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;
  
  // Validate input
  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required!" });
  }
  
  if (tokenUserId === receiverId) {
    return res.status(400).json({ message: "Cannot chat with yourself!" });
  }
  
  try {
    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId]
        }
      }
    });
    
    if (existingChat) {
      return res.status(200).json({
        ...existingChat,
        id: existingChat.id.toString(),
        userIDs: existingChat.userIDs.map(id => id.toString()),
        seenBy: existingChat.seenBy.map(id => id.toString())
      });
    }
    
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId]
      },
    });
    
    // Serialize BigInt fields if any
    const serializedChat = {
      ...newChat,
      id: newChat.id.toString(),
      userIDs: newChat.userIDs.map(id => id.toString()),
      seenBy: newChat.seenBy.map(id => id.toString())
    };
    
    res.status(200).json(serializedChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await retryOperation(async () => {
      return prisma.chat.update({
        where: {
          id: req.params.id,
          userIDs: { hasSome: [tokenUserId] }
        },
        data: { seenBy: { set: [tokenUserId] } }
      });
    });
    
    // Serialize the response
    const serializedChat = {
      ...chat,
      id: chat.id.toString(),
      userIDs: chat.userIDs.map(id => id.toString()),
      seenBy: chat.seenBy.map(id => id.toString())
    };
    
    res.status(200).json(serializedChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
