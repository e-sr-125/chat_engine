import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';  

@WebSocketGateway({ cors: { origin: ['http://localhost:3000','*'] , methods: ['GET','POST'],}, transports: ['websocket'],})
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;
    constructor(private chatService: ChatService, private jwt : JwtService ,) {}

    // Authenticate and join a private room
    async handleConnection(socket: Socket) {
       try {
          const token = socket.handshake.auth.token;
          if (!token) throw new Error('Missing token');

          const payload = this.jwt.verify(token);
          console.log("Decoded payload:", payload);

          socket.data.userId = payload.userId;
          socket.join(payload.userId);

          console.log(`User connected: ${payload.userId}`);
        } catch (err) {
          console.error('Auth error:', err);
          socket.disconnect();
        }
    }

    
    @SubscribeMessage('send_message')
    async handleMessage (
        @MessageBody () data : { receiverId : string ; content : string } ,
        @ConnectedSocket () socket : Socket ,
    ) {
        const senderId = socket.data.userId ;
        const message = await this.chatService.saveMessage ({
                senderId ,
                receiverId : data.receiverId ,
                content : data.content ,
        }) ;
       // Emit to sender + receiver only
       this.server.to(message.senderId).emit ( 'receive_message', message ) ;
       this.server.to(message.receiverId).emit ('receive_message', message ) ;
    }
}



