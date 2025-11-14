import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
    async saveMessage(data: { author_id: string; receiver_id: string; body: string }) {
        return prisma.message.create({
            data: {
                author_id: data.author_id,
                receiver_id: data.receiver_id,
                body: data.body,
            },
        });
    }
}

