import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async saveMessage({
    senderId,
    receiverId,
    content,
  }: {
    senderId: string;
    receiverId: string;
    content: string;
  }) {
    const sender = await prisma.user.findUnique({ where: { username: senderId } });
    if (!sender) throw new Error(`Sender with id ${senderId} does not exist`);

    // Ensure receiver exists
    const receiver = await prisma.user.findUnique({ where: { username: receiverId } });
    if (!receiver) throw new Error(`Receiver with id ${receiverId} does not exist`);
    return prisma.message.create({
      data: {
        senderId : sender.id,
        receiverId : receiver.id,
        content,
      },
    });
  }

  async getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;  // returns user or null
  }

}
