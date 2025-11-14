import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class MessageService {
    async getUserMessages(userId: string) {
        return prisma.message.findMany({
            where: { OR: [{author_id: userId, receiver_id: userId }] },
            orderBy: { created_at: 'asc' },
        });

    }   
}