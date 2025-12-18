import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UploadModule } from '../upload/upload.module'

@Module({
  imports:[UploadModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
