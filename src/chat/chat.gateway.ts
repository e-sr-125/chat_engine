import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
    @WebSocketServer()
    server: Server;   

    constructor(private chatService: ChatService) {}

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: { author_id: string; receiver_id: string; body: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const message = await this.chatService.saveMessage(data);
        this.server.emit('receive_message', message);
    }
}

