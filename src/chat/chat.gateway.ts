import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
    @WebSocketServer()
    server: Server;
    constructor(private chatService: ChatService) {}

    private Clients: Map<string,string> =new Map()

    handleConnection(socket:Socket){
          console.log(`socket connected: ${socket.id}`);
    }

    handleDisconnect(socket:Socket){
        console.log(`Socket disconnected: ${socket.id}`);

        this.Clients.forEach((id,user)=>{
            if (id==socket.id) this.Clients.delete(user);

        });
    }

    @SubscribeMessage('register')
    async register(@MessageBody() data: { userId: string }, @ConnectedSocket() socket: Socket) {

       
       //socket.join(data.userId); // join room for this user
       const user = await this.chatService.getUser(data.userId);

       if (!user) {
          socket.emit('registered_error', `❌ User '${data.userId}' does not exist`);
          return;
        }
       this.Clients.set(user.username, socket.id);
       console.log(`User signed: ${user.username} -> ${socket.id}`);
       socket.emit('registered', `✅ Signed in as ${user.username}`);
    }
    

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: { senderId: string; receiverId: string; content: string },
        @ConnectedSocket() socket:Socket,
    ) {
        const message = await this.chatService.saveMessage(data);
        const receiverSocketId = this.Clients.get(data.receiverId);
        if (receiverSocketId) {
           this.server.to(receiverSocketId).emit('receive_message', data);
        }
       //socket.emit('receive_message', message);
    }
}


