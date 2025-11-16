import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';


@Module({
  imports: [
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  //controllers:[AppController],
})
export class AppModule {}
