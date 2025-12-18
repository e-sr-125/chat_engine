import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { UploadService } from '../upload/upload.service';


@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService,
    private uploadService: UploadService
  ) {}

  @Get(':userId')
  async getUserMessages(@Param('userId') userId: string) {
    const messages= await this.messageService.getUserMessages(userId);

    return messages

  }
}

